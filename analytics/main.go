package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"os"

	pb "analytics/controller"

	"google.golang.org/grpc"
	"google.golang.org/protobuf/types/known/anypb"
)

// AnalyticsServer реализует сервис AnalyticsService
type AnalyticsServer struct {
	pb.UnimplementedAnalyticsServiceServer
}

// GetData реализует метод GetData на AnalyticsServer
func (s *AnalyticsServer) GetData(ctx context.Context, req *pb.GetDataRequest) (*pb.GetDataResponse, error) {
	// Пример произвольных данных
	data := map[string]*anypb.Any{
		"exampleString": {Value: []byte(`{"message": "Hello, Go!"}`)},
		"exampleNumber": {Value: []byte(`12345`)},
	}

	return &pb.GetDataResponse{Data: data}, nil
}

func main() {
	port := os.Getenv("GO_PORT")

	listener, err := net.Listen("tcp", ":"+port)
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()
	pb.RegisterAnalyticsServiceServer(grpcServer, &AnalyticsServer{})

	fmt.Println(`gRPC server is running on port`, port)
	if err := grpcServer.Serve(listener); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}
