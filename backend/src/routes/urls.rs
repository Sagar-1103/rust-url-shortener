use axum::{
    Router,
    routing::post,
};

use crate::{handlers::urls::shorten::shorten_url, state::AppState};

pub fn urls_routes() -> Router<AppState> {
    Router::new()
    .route("/shorten",post(shorten_url))
}