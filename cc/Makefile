CFLAGS := -Wall -std=c++20

BINS := demo

demo: demo.cc $(shell find aatree -type f)
	g++ -o $@ $(CFLAGS) $<

clean:
	rm -f $(BINS) *.o