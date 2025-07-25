import { useEffect, useState, useMemo } from "react";
import { Text, TouchableOpacity, View, StyleSheet, Vibration, useColorScheme } from "react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import TimerSetup from "@/components/TimerSetup";
import ProgressBarCircle from "@/components/ProgressBarCircle"; // Importe o novo componente
import { router } from "expo-router";


export default function Index() {
  const [time, setTime] = useState(0);
  const [focusTime, setFocusTime] = useState(25)
  const [breakTime, setBreakTime] = useState(5)
  const [seconds, setSeconds] = useState(0);
  const [pause, setPause] = useState(true);
  const [stoped, setStoped] = useState(true)
  const [isFocus, setIsFocus] = useState(true);

  // Estados para o tempo total da sessão atual (foco ou pausa)
  const [currentSessionTotalTime, setCurrentSessionTotalTime] = useState(focusTime * 60);

  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  const styles = getStyle(isDark)

  // Atualiza o tempo total da sessão quando o foco ou o tempo de pausa mudam
  useEffect(() => {
    if (isFocus) {
      setCurrentSessionTotalTime(focusTime * 60);
      setTime(focusTime);
    } else {
      setCurrentSessionTotalTime(breakTime * 60);
      setTime(breakTime);
    }
    setSeconds(0);
  }, [isFocus, focusTime, breakTime]);


  useEffect(() => {
    if (!pause) {
      const start = Date.now(); // hora atual em milissegundos
      const duration = time * 60 + seconds; // tempo total restante em segundos
      const end = start + duration * 1000; // calcula o timestamp do fim

      const interval = setInterval(() => {
        const now = Date.now();
        const timeLeft = Math.max(0, Math.floor((end - now) / 1000)); // em segundos

        const newMinutes = Math.floor(timeLeft / 60);
        const newSeconds = timeLeft % 60;

        setTime(newMinutes);
        setSeconds(newSeconds);

        if (timeLeft <= 0) {
          clearInterval(interval);
          Vibration.vibrate(500);
          setIsFocus(!isFocus);
          if(isFocus){
            setTime(focusTime)
          } else {
            setTime(breakTime)
          }
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [pause, isFocus, focusTime, breakTime]);


  useEffect(() => {
    if (stoped) {
      setTime(focusTime)
      setSeconds(0)
      setIsFocus(true); // Garante que, ao parar, volta para o modo foco
      setCurrentSessionTotalTime(focusTime * 60); // Reseta o tempo total da sessão
    }
  }, [focusTime, breakTime, stoped])

  const reset = () => {
    setPause(true);
    setStoped(true);
    setIsFocus(true); // volta para modo foco
    setTime(focusTime);
    setSeconds(0);
    setCurrentSessionTotalTime(focusTime * 60); // Reseta o tempo total da sessão
  }

  // Calcula o progresso para o círculo
  const totalCurrentSeconds = time * 60 + seconds;
  const elapsed = currentSessionTotalTime - totalCurrentSeconds;

  const progress = useMemo(() => {
    if (currentSessionTotalTime === 0) return 0;
    return (elapsed / currentSessionTotalTime) * 100;
  }, [elapsed, currentSessionTotalTime]);


  return (
    <View style={styles.container} >
      <Text style={styles.infoText}>
        {stoped ? "Parado" : isFocus ? "Foco" : "Pausa"}
      </Text>

      {/* Círculo de Progresso */}
      <View style={styles.circleContainer}>
        <ProgressBarCircle
          progress={progress}
          radius={120}
          strokeWidth={15}
          backgroundColor={isDark ? '#555' : '#ccc'}
          foregroundColor={isDark ? '#80e080' : '#4caf50'}
        />
        {/* Tempo */}
        <Text style={styles.timer}>
          {time.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </Text>
      </View>


      {/* Informações de Seção/Pausa */}
      {pause && (
        <View style={styles.infoRow}>
          <TimerSetup
            focusTime={focusTime}
            breakTime={breakTime}
            onFocusChange={setFocusTime}
            onBreakChange={setBreakTime}
            Dark={isDark}
          />
        </View>
      )}
      {/* Botão Play/Pause */}
      <View style={styles.controlsRow}>
        <TouchableOpacity onPress={reset} style={styles.playButton}>
          <FontAwesome6 name={"stop"} size={20} color={isDark ? '#fefefe' : "#000"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setPause(!pause); setStoped(false) }} style={styles.playButton}>
          <FontAwesome6 name={!pause ? "pause" : "play"} size={20} color={isDark ? '#fefefe' : "#000"} />
        </TouchableOpacity>
      </View>

      {/* Ícone de som (visual apenas) */}
      <TouchableOpacity style={styles.soundIcon} onPress={() => router.push('/Customization')}>
        <FontAwesome6 name="paintbrush" size={24} color={isDark ? '#fefefe' : "black"} />
      </TouchableOpacity >
    </View>
  );
}

function getStyle(isDark: boolean) {
  return (
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: isDark ? '#2f2f2f' : '#f2f2f2',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 40,
      },
      infoText: {
        color: isDark ? '#fff' : "#000",
        fontSize: 16,
        marginBottom: 20, // Espaço entre o texto de info e o timer
      },
      circleContainer: {
        position: 'relative', // Para posicionar o texto sobre o círculo
        width: 240, // 2 * radius (120)
        height: 240, // 2 * radius (120)
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
      },
      timer: {
        fontSize: 64,
        fontWeight: '700',
        color: isDark ? '#fefefe' : '#000',
        position: 'absolute', // Coloca o texto sobre o círculo
      },
      infoRow: {
        flexDirection: 'row',
        gap: 40,
        marginBottom: 20,
      },
      infoItem: {
        alignItems: 'center',
      },
      infoLabel: {
        fontSize: 12,
        color: '#555',
      },
      infoValue: {
        fontSize: 16,
        fontWeight: '600',
      },
      controlsRow: {
        display: "flex",
        flexDirection: 'row',
        gap: 20,
        marginTop: 20,
      },
      playButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderColor: isDark ? '#fefefe' : '#000',
        borderWidth: 1,
        borderRadius: 20
      },
      soundIcon: {
        position: 'absolute',
        bottom: 50,
        right: 25,
        paddingHorizontal: 15,
        paddingVertical: 10
      },
    })
  )
}