use axum::{
    Router, routing::{get, post},
};

use crate::{handlers::auth::{login::login_user, user::get_user}, state::AppState};

pub fn auth_routes() -> Router<AppState> {
    Router::new()
    .route("/login", post(login_user))
    .route("/profile", get(get_user))
}