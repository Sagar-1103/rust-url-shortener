use axum::extract::FromRequestParts;
use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation, decode, encode};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{config::env::ENV, utils::error::ApiError};

pub struct Keys {
    pub encoding: EncodingKey,
    pub decoding: DecodingKey,
}

impl Keys {
    pub fn new(jwt_secret: String) -> Self {
        let secret = jwt_secret.as_bytes();
        Keys {
            encoding: EncodingKey::from_secret(secret),
            decoding: DecodingKey::from_secret(secret),
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub user_id: Uuid,
    pub exp: usize,
}

impl Claims {
    pub fn generate_token(&self) -> Result<String, ApiError> {
        encode(&Header::default(), &self, &ENV.keys.encoding).map_err(|_| ApiError::TokenCreation)
    }
}

impl<S> FromRequestParts<S> for Claims
where
    S: Sync + Send,
{
    type Rejection = ApiError;
    async fn from_request_parts(
        parts: &mut axum::http::request::Parts,
        _state: &S,
    ) -> Result<Self, Self::Rejection> {
        let auth_header = parts
            .headers
            .get("authorization")
            .ok_or(ApiError::InvalidToken)?;
        let auth_str = auth_header.to_str().map_err(|_| ApiError::InvalidToken)?;
        let token = auth_str
            .strip_prefix("Bearer ")
            .ok_or(ApiError::InvalidToken)?;

        let token_data = decode::<Claims>(token, &ENV.keys.decoding, &Validation::default())
            .map_err(|_| ApiError::InvalidToken)?;

        Ok(token_data.claims)
    }
}

#[derive(Serialize)]
pub struct Tokens {
    pub access_token: String,
    pub refresh_token: String,
}
