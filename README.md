## How to run ##
1. To start ZooKeeper, run the command **`bin/zkServer.sh start`** from apache-zookeeper-3.7.1-bin folder
2. Run the command **`gradle build`** to compile the source code and create a JAR file.
3. The JAR file will be located in the **Producer-1/build/libs** directory.
4. To start producer, run the command **`java -jar Producer-1-0.0.1-SNAPSHOT.jar  --spring.config.location=../../../configs/producer2.properties`**
with corresponding properties file.