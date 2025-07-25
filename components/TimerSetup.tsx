import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

interface TimerSetupProps {
  focusTime: number;
  breakTime: number;
  onFocusChange: (value: number) => void;
  onBreakChange: (value: number) => void;
  Dark: boolean
}

const { height } = Dimensions.get("window");
const ITEM_HEIGHT = 40;

const generateMinutes = () => Array.from({ length: 60 }, (_, i) => i + 1);

export default function TimerSetup({
  focusTime,
  breakTime,
  onFocusChange,
  onBreakChange,
  Dark
}: TimerSetupProps) {

  const VISIBLE_ITEMS = 3;
    const ITEM_HEIGHT = 40;
    const LIST_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS; // 200px se for 5 itens

  const focusRef = useRef(null);
  const breakRef = useRef(null);

  const styles = getStyle(Dark)

  const scrollToIndex = (ref:any, index:any) => {
    ref.current?.scrollToIndex({ index, animated: true });
  };

  const handleScrollEnd = (event: any, setter: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    setter(index + 1);
  };

    useEffect(() => {
        scrollToIndex(focusRef, focusTime - 1); // -1 porque o índice começa em 0
        scrollToIndex(breakRef, breakTime - 1);
    }, []);

  const data = generateMinutes();

  return (
    <View style={styles.container}>
      <View style={styles.selectorRow}>
        {/* Seção */}
        <View style={styles.selector}>
          <Text style={styles.label}>Seção</Text>
          <FlatList
            data={data}
            ref={focusRef}
            keyExtractor={(item) => item.toString()}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onMomentumScrollEnd={(e) => handleScrollEnd(e, onFocusChange)}
            getItemLayout={(_, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
            style={{ height: LIST_HEIGHT }} // limita a altura visível
            contentContainerStyle={{
                paddingVertical: (LIST_HEIGHT - ITEM_HEIGHT) / 2, // centraliza item selecionado
            }}
            renderItem={({ item }) => (
              <Text style={[styles.item, item === focusTime && styles.selected]}>
                {item}
              </Text>
            )}
          />
        </View>

        {/* Pausa */}
        <View style={styles.selector}>
          <Text style={styles.label}>Pausa</Text>
          <FlatList
            data={data}
            ref={breakRef}
            keyExtractor={(item) => item.toString()}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onMomentumScrollEnd={(e) => handleScrollEnd(e, onBreakChange)}
            getItemLayout={(_, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
            style={{ height: LIST_HEIGHT }} // limita a altura visível
            contentContainerStyle={{
                paddingVertical: (LIST_HEIGHT - ITEM_HEIGHT) / 2, // centraliza item selecionado
            }}
            renderItem={({ item }) => (
              <Text style={[styles.item, item === breakTime && styles.selected]}>
                {item}
              </Text>
            )}
          />
        </View>
      </View>
    </View>
  );
}

function getStyle(Dark: boolean) {
    return StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: Dark ? '#2f2f2f' : "#f2f2f2",
    alignItems: "center",
  },
  selectorRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  selector: {
    width: "40%",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
    color: Dark ? '#fff' :"#000",
  },
  item: {
    fontSize: 24,
    color: "#aaa",
    textAlign: "center",
    height: ITEM_HEIGHT,
    lineHeight: ITEM_HEIGHT,
  },
  selected: {
    color: Dark ? '#fff' :"#000",
    fontSize: 28,
    fontWeight: "bold",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#222",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
})
}
