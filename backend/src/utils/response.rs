use serde::Serialize;

#[derive(Serialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub message: String,
    pub data: Option<T>,
}

impl<T> ApiResponse<T> {
    pub fn success(message: impl Into<String>, value:T) -> ApiResponse<T> {
        ApiResponse { 
            success: true,
            message: message.into(),
            data: Some(value)
        }
    }
    pub fn error(message: impl Into<String>) -> ApiResponse<T> {
        ApiResponse { 
            success: false,
            message: message.into(),
            data: None
        }
    }
}