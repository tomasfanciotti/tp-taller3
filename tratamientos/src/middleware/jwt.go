package middleware

import (
	"drugs/src/config"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
)

type JwtData struct {
	UserID     string
	TelegramID string
	Email      string
}

func ExtractDataFromJWT(tokenString string) (*JwtData, error) {
	if tokenString == "" {
		return nil, fmt.Errorf("error token is missing")
	}
	jwtConfig := config.GetConfig().JWT

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Sanity check: the algorithm must be the same as the one in the env var
		if token.Method.Alg() != jwtConfig.Algorithm {
			return nil, fmt.Errorf("error unexpected signing method: %s", token.Method.Alg())
		}

		return []byte(jwtConfig.Secret), nil
	})

	if err != nil {
		return nil, fmt.Errorf("error parsing JWT: %v", err)
	}

	// Access the claims if the signature is valid
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		telegramId := ""
		if claims["telegram_id"] != nil {
			telegramId = claims["telegram_id"].(string)
		}
		return &JwtData{
			UserID:     claims["user_id"].(string),
			Email:      claims["email"].(string),
			TelegramID: telegramId,
		}, nil
	}

	return nil, fmt.Errorf("error invalid JWT")
}
