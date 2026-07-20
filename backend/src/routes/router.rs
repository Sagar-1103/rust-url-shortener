use axum::{
    Router,
    routing::get,
};

use crate::{handlers::redirect::redirect_url, middlewares::cors::cors_layer, routes::api::api_router, state::AppState};

pub fn create_router(state: AppState) -> Router {
    Router::new()
    .nest("/api",api_router())
    .route("/{code}", get(redirect_url))
    .layer(cors_layer())
    .with_state(state)
}