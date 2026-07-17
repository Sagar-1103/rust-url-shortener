use std::{env,sync::LazyLock};
use axum::http::HeaderValue;
use chrono::{Duration, TimeDelta};
use dotenv::dotenv;
use crate::utils::auth::Keys;

pub struct Env {
    pub port: u16,
    pub cors_origins: Vec<HeaderValue>,
    pub database_url: String,
    pub keys: Keys,
    pub token_expiry_duration: TimeDelta,
}

impl Env {
    pub fn load() -> Self {
        dotenv().ok();
        let jwt_secret = required_env("JWT_SECRET");
        let token_expiry_hours = optional_env("TOKEN_EXPIRY_HOURS", "24").parse::<i64>().unwrap();
        Env {
            port: optional_env("PORT", "3001").parse().unwrap(),
            cors_origins: required_env("CORS_ORIGINS").split(",").map(|origin| origin.trim().parse().unwrap()).collect(),
            database_url: required_env("DATABASE_URL"),
            keys: Keys::new(jwt_secret),
            token_expiry_duration: Duration::hours(token_expiry_hours),
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