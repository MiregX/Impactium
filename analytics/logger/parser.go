package logger

import (
	"errors"
	"regexp"
	"strconv"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
)

func ParseFilter(filter string) (bson.M, error) {
	filter = strings.TrimSpace(filter)

	if strings.Contains(filter, "||") {
		return parseLogicalFilter(filter, "||", "$or")
	}

	if strings.Contains(filter, "&&") {
		return parseLogicalFilter(filter, "&&", "$and")
	}

	return parseCondition(filter)
}

func parseLogicalFilter(filter, separator, mongoOp string) (bson.M, error) {
	parts := strings.Split(filter, separator)
	conditions := bson.A{}

	for _, part := range parts {
		parsed, err := ParseFilter(strings.TrimSpace(part))
		if err != nil {
			return nil, err
		}
		conditions = append(conditions, parsed)
	}

	return bson.M{mongoOp: conditions}, nil
}

func parseCondition(condition string) (bson.M, error) {
	re := regexp.MustCompile(`^(\w+):\s*([><=]{1,2})\s*([^\s]+)$`)
	matches := re.FindStringSubmatch(strings.Trim(condition, "{}"))

	if len(matches) != 4 {
		return nil, errors.New("invalid filter condition: " + condition)
	}

	field, operator, value := matches[1], matches[2], matches[3]
	parsedValue := parseValue(value)
	mongoOperator, err := convertOperator(operator)
	if err != nil {
		return nil, err
	}

	return bson.M{field: bson.M{mongoOperator: parsedValue}}, nil
}

func parseValue(value string) interface{} {
	if intValue, err := strconv.Atoi(value); err == nil {
		return intValue
	}
	return value
}

func convertOperator(op string) (string, error) {
	switch op {
	case ">":
		return "$gt", nil
	case ">=":
		return "$gte", nil
	case "<":
		return "$lt", nil
	case "<=":
		return "$lte", nil
	case "=":
		return "$eq", nil
	default:
		return "", errors.New("invalid operator: " + op)
	}
}
