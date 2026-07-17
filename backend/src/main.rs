use axum::{
    Router,
};

mod config;
mod middlewares;
mod routes;
mod handlers;
mod utils;
mod state;
mod db;
mod entities;

use crate::db::connect_db;
use crate::routes::router::create_router;
use crate::config::env::ENV;
use crate::state::AppState;

async fn serve(app:Router, port:u16) {
    let addr = std::net::SocketAddr::from(([127,0,0,1],port));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    println!("Server running on port {port}");
    axum::serve(listener,app).await.unwrap();
}

#[tokio::main]
async fn main() {
    let port = ENV.port;
    let db = connect_db().await;
    let state = AppState { db };
    let app = create_router(state);
    serve(app, port).await;
}