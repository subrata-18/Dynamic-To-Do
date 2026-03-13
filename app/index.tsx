import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const [now, setNow] = useState(new Date());
  const [popupVisible, setPopupVisible] = useState(false);
  const [text, setText] = useState("");
  const [savedText, setSavedText] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);


  const handlePress = async () => {
    if (text.trim() === "") return;
    const newTasks = [...tasks, text];
    setTasks(newTasks);
    setText("");
    setPopupVisible(false);
    await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
  };
  const deleteTask = async (indexToDelete: number) => {
    const updatedTasks = tasks.filter((_, index) => index !== indexToDelete);
    setTasks(updatedTasks);
    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };
  useEffect(() => {
    const loadStoredTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem("tasks");
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error("Failed to load tasks", error);
      }
    };

    loadStoredTasks();

    const timer = setInterval(() => setNow(new Date()), 500);
    return () => clearInterval(timer);
  }, []);

  const dayName = now.toLocaleDateString(undefined, { weekday: "long" });
  const fullDate = now.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric", });
  const hours = (now.getHours() % 12 || 12).toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const time12 = `${hours}:${minutes}`;
  const ampm = now.getHours() >= 12 ? "pm" : "am";

  return (
    <View style={Style.background}>
      <View style={Style.topcontainer}>
        <View style={Style.topLeft}>
          <Text style={Style.daytext}>{dayName}</Text>
          <Text style={Style.datetext}>{fullDate}</Text>
        </View>
        <View style={Style.topRight}>
          <Text style={Style.timetext}>{time12}</Text>
          <Text style={Style.ampmtext}>{ampm}</Text>
        </View>
      </View>
      <View style={Style.bottomWrapper}>
        <ScrollView style={Style.bottomcontainer} contentContainerStyle={Style.scrollContent}>
          {tasks.map((task, index) => (
            <View key={index} style={Style.tasks}>
              <Text style={Style.taskText}>{task}</Text>
              <TouchableOpacity onPress={() => deleteTask(index)}>
                <Ionicons name="trash-outline" size={24} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity style={Style.addbutton} onPress={() => setPopupVisible(true)}>
          <Text style={Style.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <Modal transparent animationType="fade" visible={popupVisible} statusBarTranslucent>
        <TouchableOpacity style={Style.backdrop} activeOpacity={1} onPress={() => {
          setPopupVisible(false);
          setText("");
        }}>
          <TouchableOpacity style={Style.popup} activeOpacity={1} onPress={() => { }}>
            <TextInput
              style={Style.input}
              placeholder="New Objective"
              placeholderTextColor="#888"
              value={text}
              onChangeText={setText}
            />
            <View style={Style.popupButtons}>
              <TouchableOpacity style={Style.cancelBtn} onPress={() => {
                setPopupVisible(false);
                setText("");
              }}>
                <Text style={Style.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={Style.createBtn} onPress={handlePress}>
                <Text style={Style.createText}>Create</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
const Style = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#252525",
    alignItems: "center",
    justifyContent: "flex-start",
    height: "100%",
    width: "100%",
    paddingTop: 50,
  },

  topcontainer: {
    height: "15%",
    width: "90%",
    backgroundColor: "#2d2d2d",
    borderRadius: 33,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },

  topLeft: {
    justifyContent: "center",
  },

  topRight: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },

  daytext: {
    fontSize: 26,
    color: "#d4d0c8",
    fontWeight: "600",
  },

  datetext: {
    fontSize: 15,
    color: "#888",
    marginTop: 2,
  },

  timetext: {
    fontSize: 32,
    color: "#d4d0c8",
    fontWeight: "300",
  },

  ampmtext: {
    fontSize: 15,
    color: "#888",
    paddingBottom: 4,
  },

  bottomWrapper: {
    flex: 1,
    width: "90%",
    marginTop: 20,
    marginBottom: 20,
    position: "relative",
  },

  bottomcontainer: {
    flex: 1,
    backgroundColor: "#2d2d2d",
    borderRadius: 33,
  },

  scrollContent: {
    alignItems: "center",
    paddingVertical: 16,
    gap: 12,
  },

  tasks: {
    height: 70,
    width: "90%",
    backgroundColor: "#1C1C1C",
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  taskText: {
    color: "#d4d0c8",
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    marginRight: 10,
  },

  addbutton: {
    height: 80,
    width: 80,
    backgroundColor: "#d4d0c8",
    borderRadius: 20,
    position: "absolute",
    bottom: 16,
    right: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  addButtonText: {
    fontSize: 50,
    color: "#252525",
    lineHeight: 32,
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  popup: {
    width: "75%",
    backgroundColor: "#2d2d2d",
    borderRadius: 24,
    padding: 24,
    gap: 20,
  },

  input: {
    backgroundColor: "#3a3a3a",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#d4d0c8",
    fontSize: 15,
  },

  popupButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },

  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: "#3a3a3a",
  },

  cancelText: {
    color: "#d4d0c8",
    fontSize: 14,
  },

  createBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: "#d4d0c8",
  },

  createText: {
    color: "#252525",
    fontSize: 14,
    fontWeight: "600",
  },

})


