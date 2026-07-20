use crate::utils::auth::Keys;
use axum::http::HeaderValue;
use chrono::{Duration, TimeDelta};
use dotenv::dotenv;
use std::{env, sync::LazyLock};

pub struct Env {
    pub port: u16,
    pub cors_origins: Vec<HeaderValue>,
    pub database_url: String,
    pub access_token_keys: Keys,
    pub refresh_token_keys: Keys,
    pub access_token_expiry: TimeDelta,
    pub refresh_token_expiry: TimeDelta,
}

impl Env {
    pub fn load() -> Self {
        dotenv().ok();
        let access_token_secret = required_env("ACCESS_TOKEN_SECRET");
        let refresh_token_secret = required_env("REFRESH_TOKEN_SECRET");
        let access_token_expiry_hours = optional_env("ACCESS_TOKEN_EXPIRY_HOURS", "24")
            .parse::<i64>()
            .unwrap();
        let refresh_token_expiry_days = optional_env("REFRESH_TOKEN_EXPIRY_DAYS", "15")
            .parse::<i64>()
            .unwrap();

        Env {
            port: optional_env("PORT", "3001").parse().unwrap(),
            cors_origins: required_env("CORS_ORIGINS")
                .split(",")
                .map(|origin| origin.trim().parse().unwrap())
                .collect(),
            database_url: required_env("DATABASE_URL"),
            access_token_keys: Keys::new(access_token_secret),
            refresh_token_keys: Keys::new(refresh_token_secret),
            access_token_expiry: Duration::hours(access_token_expiry_hours),
            refresh_token_expiry: Duration::days(refresh_token_expiry_days),
        }
    }
}

fn optional_env(key: &str, default: &str) -> String {
    env::var(key).unwrap_or_else(|_| default.to_string())
}

fn required_env(key: &str) -> String {
    env::var(key).unwrap_or_else(|_| panic!("Environment variable {key} not defined"))
}

pub static ENV: LazyLock<Env> = LazyLock::new(|| Env::load());
