use axum::{
    Router, routing::{delete, get, post},
};

use crate::{handlers::urls::{all::get_urls, delete::delete_url, shorten::shorten_url, url::get_url}, state::AppState};

pub fn urls_routes() -> Router<AppState> {
    Router::new()
    .route("/shorten",post(shorten_url))
    .route("/",get(get_urls))
    .route("/{id}", get(get_url))
    .route("/{id}", delete(delete_url))
}