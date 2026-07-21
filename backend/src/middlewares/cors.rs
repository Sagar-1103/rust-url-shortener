use tower_http::cors::{Any, CorsLayer, AllowOrigin};

use crate::config::env::ENV;

pub fn cors_layer() -> CorsLayer {
    CorsLayer::new()
        .allow_methods(Any)
        .allow_headers(Any)
        .allow_origin(AllowOrigin::list(ENV.cors_origins.clone()))
}