package logger

import (
	"regexp"
	"strconv"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
)

func ParseFilter(filter string) bson.M {
	filter = strings.TrimSpace(filter)

	if strings.Contains(filter, "||") {
		orFilters := strings.Split(filter, "||")
		orConditions := bson.A{}

		for _, f := range orFilters {
			f = strings.TrimSpace(f)
			parsedFilter := ParseFilter(f) // Рекурсивный вызов
			if parsedFilter != nil {
				orConditions = append(orConditions, parsedFilter)
			}
		}

		return bson.M{"$or": orConditions}
	}

	if strings.Contains(filter, "&&") {
		andFilters := strings.Split(filter, "&&")
		andConditions := bson.A{}

		for _, f := range andFilters {
			f = strings.TrimSpace(f)
			parsedFilter := ParseFilter(f)
			if parsedFilter != nil {
				andConditions = append(andConditions, parsedFilter)
			}
		}

		return bson.M{"$and": andConditions}
	}

	return parseCondition(filter)
}

func parseCondition(condition string) bson.M {
	condition = strings.Trim(condition, "{}")

	re := regexp.MustCompile(`^(\w+):\s*([><=]{1,2})\s*([^\s]+)$`)
	matches := re.FindStringSubmatch(condition)
	if len(matches) != 4 {
		return nil
	}

	field := matches[1]
	operator := matches[2]
	value := matches[3]

	var parsedValue interface{}
	if intValue, err := strconv.Atoi(value); err == nil {
		parsedValue = intValue
	} else {
		parsedValue = value
	}

	var mongoOperator string
	switch operator {
	case ">":
		mongoOperator = "$gt"
	case ">=":
		mongoOperator = "$gte"
	case "<":
		mongoOperator = "$lt"
	case "<=":
		mongoOperator = "$lte"
	default:
		mongoOperator = "$eq"
	}

	return bson.M{field: bson.M{mongoOperator: parsedValue}}
}
