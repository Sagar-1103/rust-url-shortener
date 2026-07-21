use axum::{
    Router, routing::{delete, get, patch, post},
};

use crate::{handlers::urls::{all::get_urls, archive::toggle_archive, delete::delete_url, shorten::shorten_url, stats::get_dashboard_stats, update::update_url, url::get_url}, state::AppState};

pub fn urls_routes() -> Router<AppState> {
    Router::new()
    .route("/shorten", post(shorten_url))
    .route("/stats", get(get_dashboard_stats))
    .route("/", get(get_urls))
    .route("/{id}/toggle-archive", patch(toggle_archive))
    .route("/{id}", get(get_url))
    .route("/{id}", patch(update_url))
    .route("/{id}", delete(delete_url))
}