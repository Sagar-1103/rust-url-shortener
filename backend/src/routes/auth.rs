use axum::{
    Router, routing::{get, post},
};

use crate::{handlers::auth::{login::login_user, signup::signup_user, user::get_user}, state::AppState};

pub fn auth_routes() -> Router<AppState> {
    Router::new()
    .route("/signup", post(signup_user))
    .route("/login", post(login_user))
    .route("/profile", get(get_user))
}