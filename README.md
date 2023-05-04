## How to run ##
1. To start ZooKeeper, run the command **`bin/zkServer.sh start`** from apache-zookeeper-3.7.1-bin folder
2. Run the command **`gradle build`** to compile the source code and create a JAR file.
3. The JAR file will be located in the **Producer-1/build/libs** directory.
4. To start producer, run the command **`java -jar Producer-1-0.0.1-SNAPSHOT.jar  --spring.config.location=../../../configs/producer2.properties`**
with corresponding properties file.
## How to run observability ## 
1. Run **Prometheus** in docker using command **`docker run -d -p 9090:9090 -v "$PWD"/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus`**
2. Run **Grafana** using command **`./grafana-9.4.7/bin/grafana server`**

Now you can see dashboards on http://localhost:9090

## Dashboards examples ##
**Producer JVM dashboard**
![Producer dashboard](images/producers.png?raw=true "Producer JVM dashboard")
**ZooKeeper dashboard**
![ZooKeeper dashboard](images/zookeeper.png?raw=true "ZooKeeper JVM dashboard")


## How to run with ELK Stack ## 
1. Run docker compose using command **`docker-compose up`**
Now you can see logs in kibana http://localhost:5601
**Kibana page**
![Kibana page](images/kibana.png?raw=true "Kibana logs page")