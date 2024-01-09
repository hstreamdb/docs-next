package main

import (
	"log"
	"reflect"
	"runtime"

	"github.com/hstreamdb/hstream-kafka-go-examples/examples"
)

func main() {
	xs := []func(){
		examples.CreateTopics,
		examples.Produce,
		examples.Consume,
	}

	for _, x := range xs {
		runFuncWithLog(x)
	}

}

func getFuncName(i interface{}) string {
	return runtime.FuncForPC(reflect.ValueOf(i).Pointer()).Name()
}

func runFuncWithLog(f func()) {
	funcName := getFuncName(f)
	log.Printf("==== start %s ====", funcName)
	f()
	log.Printf("==== end %s ====", funcName)
}
