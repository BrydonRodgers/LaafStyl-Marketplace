#!/bin/bash

# LaafStyl Marketplace - Local Testing Script
# Usage: ./LOCAL_TEST.sh

set -e

echo "========================================="
echo "LaafStyl Marketplace - Local Test Suite"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
PASSED=0
FAILED=0

# Test function
run_test() {
    local test_name=$1
    local command=$2

    echo -n "Testing: $test_name ... "
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}FAIL${NC}"
        ((FAILED++))
    fi
}

echo "1. DOCKER CHECKS"
echo "================"
run_test "Docker daemon running" "docker ps > /dev/null 2>&1"
run_test "Docker Compose available" "docker compose version > /dev/null 2>&1"

echo ""
echo "2. CONTAINER CHECKS"
echo "==================="
run_test "PostgreSQL container exists" "docker ps -a | grep laafstyl_marketplace_postgres"
run_test "App container exists" "docker ps -a | grep laafstyl_marketplace_app"

echo ""
echo "3. LOCALHOST CHECKS"
echo "==================="
run_test "localhost:3000 responsive" "curl -s http://localhost:3000 | head -1 > /dev/null"
run_test "localhost:5432 (PostgreSQL)" "timeout 2 bash -c '</dev/tcp/localhost/5432' 2>/dev/null"

echo ""
echo "4. FILES CHECK"
echo "=============="
run_test "docker-compose.yml exists" "[ -f docker-compose.yml ]"
run_test "package-lock.json exists" "[ -f package-lock.json ]"
run_test ".env file exists" "[ -f .env ]"
run_test "Dockerfile exists" "[ -f Dockerfile ]"

echo ""
echo "5. NGROK CHECK"
echo "=============="
run_test "ngrok installed" "which ngrok > /dev/null 2>&1"
if which ngrok > /dev/null 2>&1; then
    run_test "ngrok authenticated" "[ -f ~/.ngrok2/ngrok.yml ]"
fi

echo ""
echo "========================================="
echo -e "Results: ${GREEN}${PASSED} PASSED${NC} / ${RED}${FAILED} FAILED${NC}"
echo "========================================="

if [ $FAILED -gt 0 ]; then
    echo ""
    echo "TROUBLESHOOTING:"
    echo "- Start Docker: docker compose up --build"
    echo "- Check logs: docker compose logs app"
    echo "- Reset all: docker compose down -v && docker compose up --build"
    exit 1
fi

echo ""
echo "All checks passed!"
echo "Ready to test API calls."
echo ""
echo "Test checkout endpoint:"
echo "curl -X POST http://localhost:3000/api/checkout \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"items\": []}'"
