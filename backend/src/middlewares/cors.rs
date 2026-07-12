use axum::http::Method;
use tower_http::cors::{CorsLayer,AllowOrigin};

use crate::config::env::ENV;

pub fn cors_layer() -> CorsLayer {
    CorsLayer::new()
    .allow_methods([
        Method::GET,
        Method::POST,
        Method::PUT,
        Method::PATCH,
        Method::DELETE,
    ])
    .allow_origin(AllowOrigin::list(ENV.cors_origins.clone()))
}