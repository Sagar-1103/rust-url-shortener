use axum::{
    Router,
};

use crate::{middlewares::cors::cors_layer, routes::api::api_router};

pub fn create_router() -> Router {
    Router::new()
    .nest("/api",api_router())
    .layer(cors_layer())
}