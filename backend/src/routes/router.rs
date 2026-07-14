use axum::{
    Router,
};

use crate::{middlewares::cors::cors_layer, routes::api::api_router, state::AppState};

pub fn create_router(state: AppState) -> Router {
    Router::new()
    .nest("/api",api_router())
    .layer(cors_layer())
    .with_state(state)
}