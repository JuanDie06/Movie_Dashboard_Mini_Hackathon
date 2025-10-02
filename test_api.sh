#!/bin/bash

echo "========================================="
echo "Phase 6: Backend API Integration Tests"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

test_count=0
pass_count=0
fail_count=0

test_endpoint() {
    local method=$1
    local url=$2
    local description=$3
    local expected_status=${4:-200}
    
    test_count=$((test_count + 1))
    echo -n "Test $test_count: $description... "
    
    response=$(curl -s -w "\n%{http_code}" -X $method "$url" -H "Content-Type: application/json" 2>&1)
    status_code=$(echo "$response" | tail -n 1)
    
    if [ "$status_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}PASS${NC} (Status: $status_code)"
        pass_count=$((pass_count + 1))
    else
        echo -e "${RED}FAIL${NC} (Expected: $expected_status, Got: $status_code)"
        fail_count=$((fail_count + 1))
    fi
}

echo "Testing Movies Endpoints..."
echo "-------------------------------------------"
test_endpoint "GET" "http://localhost:3000/api/v1/movies" "List all movies"
test_endpoint "GET" "http://localhost:3000/api/v1/movies/42" "Get movie by ID"
test_endpoint "GET" "http://localhost:3000/api/v1/movies/popular" "Get popular movies"
test_endpoint "GET" "http://localhost:3000/api/v1/movies/recent" "Get recent movies"
test_endpoint "GET" "http://localhost:3000/api/v1/movies?search=love" "Search movies"
echo ""

echo "Testing Genres Endpoints..."
echo "-------------------------------------------"
test_endpoint "GET" "http://localhost:3000/api/v1/genres" "List all genres"
test_endpoint "GET" "http://localhost:3000/api/v1/genres/1" "Get genre by ID"
test_endpoint "GET" "http://localhost:3000/api/v1/genres/1/movies" "Get movies by genre"
echo ""

echo "Testing Reviews Endpoints..."
echo "-------------------------------------------"
test_endpoint "GET" "http://localhost:3000/api/v1/reviews" "List all reviews"
test_endpoint "GET" "http://localhost:3000/api/v1/reviews/highest_rated" "Get highest rated reviews"
test_endpoint "GET" "http://localhost:3000/api/v1/movies/42/reviews" "Get reviews for movie"
echo ""

echo "Testing Watchlists Endpoints..."
echo "-------------------------------------------"
test_endpoint "GET" "http://localhost:3000/api/v1/watchlists" "List all watchlists"
test_endpoint "GET" "http://localhost:3000/api/v1/watchlists/stats" "Get watchlist stats"
test_endpoint "GET" "http://localhost:3000/api/v1/watchlists?status=watched" "Filter by status"
echo ""

echo "Testing Error Handling..."
echo "-------------------------------------------"
test_endpoint "GET" "http://localhost:3000/api/v1/movies/999999" "Non-existent movie" 404
test_endpoint "GET" "http://localhost:3000/api/v1/genres/999999" "Non-existent genre" 404
echo ""

echo "========================================="
echo "Test Summary"
echo "========================================="
echo "Total Tests: $test_count"
echo -e "${GREEN}Passed: $pass_count${NC}"
echo -e "${RED}Failed: $fail_count${NC}"
echo ""

if [ $fail_count -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed. Please review.${NC}"
    exit 1
fi
