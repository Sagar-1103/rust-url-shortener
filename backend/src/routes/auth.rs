use axum::{
    Router,
};

use crate::state::AppState;

pub fn auth_routes() -> Router<AppState> {
    Router::new()
}