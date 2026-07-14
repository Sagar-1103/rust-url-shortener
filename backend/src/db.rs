use sea_orm::{Database,DatabaseConnection};

use crate::config::env::ENV;

pub async fn connect_db() -> DatabaseConnection {
    let db = Database::connect(&ENV.database_url).await.expect("Error connecting database");
    println!("Database Connected");
    return db;
}

pub async fn check_db(db: DatabaseConnection) -> bool {
    db.ping().await.is_ok()
}