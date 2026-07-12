use std::{env,sync::LazyLock};
use dotenv::dotenv;

pub struct Env {
    pub port: u16,
}

impl Env {
    pub fn load() -> Env {
        dotenv().ok();
        Env {
            port: optional_env("PORT", "3001").parse().unwrap()
        }
    } 
}

fn optional_env(key: &str, default: &str) -> String {
    env::var(key).unwrap_or_else(|_| default.to_string())
}

pub static ENV: LazyLock<Env> = LazyLock::new(|| Env::load());