use std::{env,sync::LazyLock};
use axum::http::HeaderValue;
use dotenv::dotenv;

pub struct Env {
    pub port: u16,
    pub cors_origins: Vec<HeaderValue>,
}

impl Env {
    pub fn load() -> Env {
        dotenv().ok();
        Env {
            port: optional_env("PORT", "3001").parse().unwrap(),
            cors_origins: required_env("CORS_ORIGINS").split(",").map(|origin| origin.trim().parse().unwrap()).collect(),
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