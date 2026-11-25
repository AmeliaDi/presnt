(function () {
  "use strict";

  const STAGE_W = 1280;
  const STAGE_H = 720;

  const slides = Array.from(document.querySelectorAll(".slide"));
  const stage = document.getElementById("stage");
  const progressFill = document.getElementById("progress-fill");
  const counterEl = document.getElementById("slide-counter");
  const stepDotsEl = document.getElementById("step-dots");
  const stepLabelEl = document.getElementById("hud-step-label");
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  const btnOverview = document.getElementById("btn-overview");
  const btnOverviewClose = document.getElementById("btn-overview-close");
  const overviewModal = document.getElementById("overview-modal");
  const overviewGrid = document.getElementById("overview-grid");
  const btnNotes = document.getElementById("btn-notes");
  const btnNotesClose = document.getElementById("btn-notes-close");
  const notesPanel = document.getElementById("notes-panel");
  const notesText = document.getElementById("notes-text");
  const btnFullscreen = document.getElementById("btn-fullscreen");
  const btnHardcore = document.getElementById("btn-hardcore");
  const btnHardcoreFinal = document.getElementById("btn-hardcore-final");
  const btnHardcoreClose = document.getElementById("btn-hardcore-close");
  const hardcoreModal = document.getElementById("hardcore-modal");
  const hcTabs = Array.from(document.querySelectorAll("[data-hc-tab]"));
  const hcGrid = document.getElementById("hc-grid");
  const hcSearch = document.getElementById("hc-search");
  const hcCountBadge = document.getElementById("hc-count-badge");
  const hcEmpty = document.getElementById("hc-empty");
  const hcSimPanel = document.getElementById("hc-sim-panel");
  const hcArchPanel = document.getElementById("hc-arch-panel");
  const simDur = document.getElementById("sim-dur");
  const simDurVal = document.getElementById("sim-dur-val");
  const simNote = document.getElementById("sim-note");
  const simMode = document.getElementById("sim-mode");
  const simResults = document.getElementById("sim-results");
  const audioStatusEl = document.getElementById("audio-status");

  // Notas del orador (1-2 frases por diapositiva, ocultas por defecto con tecla N)
  const SPEAKER_NOTES = [
    "Presentar el proyecto de Amelia Enora Marceline Chavez B. y Fernando Hernandez: convertir azar en música comparando dos optimizaciones.",
    "Diapositiva reservada para el contexto musical ya preparado.",
    "Explicar por qué el azar puro suena desconectado y cómo Voraz y Backtracking resuelven ese problema de dos formas distintas.",
    "Mostrar con el ejemplo de 10 s (23 notas por instrumento) qué entra, qué escala fija se construye y qué 3 WAV salen.",
    "Recorrer las 5 etapas una por una (o con ▶ Animar / tecla P) señalando su complejidad: constante O(1), lineal O(N), exponencial acotada y síntesis.",
    "Revelar cada algoritmo en orden y aclarar cuál genera cada archivo de audio.",
    "Explicar el Movimiento Browniano: a diferencia de números al azar sin memoria, cada paso parte del anterior y su costo es lineal O(N).",
    "Mostrar por qué las tablas hash hacen que buscar escalas, grados y tonos MIDI tome tiempo constante O(1) sin importar la duración.",
    "Aclarar la trampa de examen: aunque HeapMax es logarítmico, el tamaño G = 7 es fijo, así que el Voraz completo es lineal O(N).",
    "Explicar por qué Backtracking es exponencial O(3^N) en teoría y cómo la poda + el tope de 4000 nodos lo vuelven práctico.",
    "Detallar la síntesis: ordenar las N notas cuesta O(N log N) y apagar notas antes de encender evita notas colgadas en las S muestras.",
    "Traza 1 en C mayor: seguir en vivo el explicador de la línea, la aritmética ×100 % 6 y la casilla exacta de la escala.",
    "Traza 2: explicar la fórmula p = -(d_obj + 0.5·d_ant), cómo el máximo siempre queda en el índice [0] y el bajo responde en pares.",
    "Traza 3: mostrar en el mapa de niveles que 7a cuesta 1, 3a cuesta 2 y 5a cuesta 3; por eso gana [D3, F3, G3] y las demás se podan.",
    "Primero mostrar los 5 casos que el código sí valida y al final el único caso no manejado (texto o falta del archivo .sf2).",
    "Explicar cada fila junto con su curva en la gráfica: constante no sube, lineal sube parejo y O(3^N) explota si no se poda.",
    "Cerrar conectando las tres ideas: impacto musical del algoritmo, estructuras correctas y viabilidad gracias a la poda.",
    "Agradecer en nombre de Amelia y Fernando; reproducir los WAV en vivo o abrir la Biblioteca Hardcore (tecla B) ante cualquier duda profunda."
  ];

  // =========================================================
  // CATÁLOGO ENCICLOPÉDICO DE LA BIBLIOTECA HARDCORE (40 FICHAS)
  // Extraído 100% del código real del proyecto y su sintetizador
  // =========================================================
  const HARDCORE_ITEMS = [
    // --- ALGORITMOS (7) ---
    {
      cat: "algoritmos",
      tag: "Algoritmo · L35–64",
      pill: "Constante · Θ(1)",
      pillCls: "comp-pill--const",
      title: "1. Construcción de escalas cromáticas por semitonos",
      ref: "escala_por_intervalos(tonica, modo, octava=3) · construir_repositorio_escalas()",
      snippet: "base_midi = 12 * (octava + 1)  # 48 (C3)\nmidi_fijado = base_midi + (p_nota.midi % 12)",
      rows: [
        ["De dónde sale", "Sistema temperado de 12 semitonos: patrón mayor [0,2,4,5,7,9,11] y menor natural [0,2,3,5,7,8,10]."],
        ["Para qué sirve", "Precalcula las 24 escalas posibles (12 tónicas × 2 modos) plegadas dentro de la octava 3 (MIDI 48..59)."],
        ["Cómo se conecta", "Lee nota_para_la_escala y modo_de_la_escala; entrega escala_actual (7 strings) a Browniano, Voraz y Backtracking."],
        ["Complejidad", "Tiempo Θ(1) y Espacio Θ(1): ejecuta exactamente 12 × 2 × 7 = 168 iteraciones fijas siempre."]
      ]
    },
    {
      cat: "algoritmos",
      tag: "Algoritmo · L68–145",
      pill: "Lineal · O(N)",
      pillCls: "comp-pill--linear",
      title: "2. Movimiento Browniano 1D (Caminata Gaussiana)",
      ref: "movimiento_browniano_bajo / guitarra_jazz / campana_tubular / steel_drums",
      snippet: "actual += random.gauss(0.0, paso)  # paso = 1.0\ncanal = [(escala_actual[int(x * 100) % 6], 1.0) for x in resultado]",
      rows: [
        ["De dónde sale", "Proceso estocástico de Wiener (física de partículas en fluidos): cada estado suma ruido normal N(0,1) al anterior."],
        ["Por qué este y no randint", "random.randint genera saltos sin memoria; el browniano preserva correlación temporal entre notas consecutivas."],
        ["Cómo se conecta", "Alimenta directo canales_config (aleatorio_bruto.wav) y genera valors_aislados_* para Voraz y Backtracking."],
        ["Complejidad", "Tiempo O(N) exacto (40N - 3 operaciones en los 4 canales) y Espacio O(N)."]
      ]
    },
    {
      cat: "algoritmos",
      tag: "Algoritmo · L240–296",
      pill: "Lineal · O(N) (G=7)",
      pillCls: "comp-pill--linear",
      title: "3. Algoritmo Voraz de aproximación armónica",
      ref: "algoritmo_voraz_para_aproximar(secuencia_base, escala, progresion, factor_paso=0.5)",
      snippet: "grado_obj = progresion[paso_idx % len(progresion)] % 7\nprioridad = -(dist_objetivo + 0.5 * dist_anterior)",
      rows: [
        ["De dónde sale", "Paradigma Greedy (elección localmente óptima sin mirar el futuro) guiado por La Folía (mayor) o Quintas (menor)."],
        ["Para qué sirve", "Equilibra caer en el grado armónico del compás (peso 1.0) sin dar saltos melódicos bruscos desde la nota previa (peso 0.5)."],
        ["Cómo se conecta", "Transforma guitarra (canal 1) y campana tubular (canal 2) usando HeapMax(candidatos).extraer_maximo()."],
        ["Complejidad", "O(N · (G + log G)) con G = 7 constante → Tiempo lineal O(N) (~240N) y Espacio O(N)."]
      ]
    },
    {
      cat: "algoritmos",
      tag: "Algoritmo · L300–330",
      pill: "Lineal · O(N)",
      pillCls: "comp-pill--linear",
      title: "4. Síntesis de voces complementarias (3ª diatónica + silencio)",
      ref: "las_notas_de_bajo_y_percusion_que_son_complementarias_a_las_otras()",
      snippet: "if i % 2 == 0: idx_tercera = (idx_ref + 2) % 7  # intervalo de 3a\nelse: resultado.append(('rest', dur))",
      rows: [
        ["De dónde sale", "Contrapunto armónico simple por terceras paralelas y respiración rítmica alternada."],
        ["Para qué sirve", "Evita que los 4 canales toquen la misma nota a la vez en voraz.wav: suma armonía en tiempos pares y aire en impares."],
        ["Cómo se conecta", "Bajo acompaña a Guitarra voraz; Steel drums acompaña a Campana voraz → arma canales_config_voraz."],
        ["Complejidad", "Tiempo Θ(N) y Espacio Θ(N): un único recorrido lineal con consulta O(1) en diccionario."]
      ]
    },
    {
      cat: "algoritmos",
      tag: "Algoritmo · L345–493",
      pill: "O(N)..O(3^N) ≤4000",
      pillCls: "comp-pill--exp",
      title: "5. Backtracking con Poda (DFS + Branch & Bound)",
      ref: "poda_de_backtracking() · dfs(paso, r3, r5, r7, costo_acum)",
      snippet: "if costo_acum >= mejor_costo: return\nif nodos_visitados > max_nodos: limite_alcanzado = True; return",
      rows: [
        ["De dónde sale", "Búsqueda en profundidad en árbol de estados con retroceso (pop) y cota superior (Branch & Bound)."],
        ["Por qué se usa", "Las restricciones de racha (max_3a=2, max_5a=2, max_7a=1) dependen del historial; si un camino encierra o encarece, retrocede."],
        ["Triple optimización", "1) Ordena candidatos por menor distancia (7a:1, 3a:2, 5a:3); 2) Poda si costo ≥ mejor_costo; 3) Tope max_nodos = 4000 + respaldo a 3a."],
        ["Complejidad", "Mejor caso O(N); Peor teórico O(3^N); Práctico acotado a ≤ 4 000 nodos por canal. Espacio O(N) en pila."]
      ]
    },
    {
      cat: "algoritmos",
      tag: "Algoritmo · L391–401",
      pill: "Constante · O(1)/paso",
      pillCls: "comp-pill--const",
      title: "6. Polifonía por división modular de turnos",
      ref: "en_que_orden_tocaran_para_que_no_se_sature(paso)",
      snippet: "bajo: paso%1==0 | guitarra: paso%2==0 | campana: paso%3==0 | drums: paso%4==0",
      rows: [
        ["De dónde sale", "Aritmética modular rítmica con períodos 1, 2, 3 y 4 (cuyo mínimo común múltiplo es MCM = 12 pulsos)."],
        ["Para qué sirve", "Despeja la textura sonora en backtracking.wav: solo cada 12 notas (paso 0, 12, 24...) suenan los 4 instrumentos juntos."],
        ["Efecto en el DFS", "En pasos donde un instrumento hace 'rest', el DFS NO ramifica en 3 hijos (solo avanza 1 llamada con mismo costo), ¡reduciendo drásticamente el árbol real!"],
        ["Complejidad", "O(1) por paso; reduce la profundidad ramificada real a N/2 (guitarra), N/3 (campana) y N/4 (steel drums)."]
      ]
    },
    {
      cat: "algoritmos",
      tag: "Algoritmo · L533–640",
      pill: "O(N log N + S)",
      pillCls: "comp-pill--nlogn",
      title: "7. Planificación discreta de eventos con Timsort y render por tramos",
      ref: "envoltorio_para_los_varios_wav() · sorted() · synth.render()",
      snippet: "instantes = sorted(set(acciones_por_muestra.keys()) | {num_muestras})\nkey=lambda x: 0 if x[0] == 'off' else 1",
      rows: [
        ["De dónde sale", "Simulación dirigida por eventos discretos (DES) + Timsort híbrido (MergeSort + InsertionSort) nativo de Python."],
        ["Por qué off antes de on", "Si en la misma muestra termina e inicia la misma nota en el mismo canal, procesar 'on' antes y 'off' después apagaría la nota nueva al instante."],
        ["Cómo se conecta", "Recibe cualquiera de las 3 configuraciones de canales, sintetiza por tramos [t_actual, t_siguiente) y escribe el .wav."],
        ["Complejidad", "Ordenar O(N) instantes cuesta O(N log N); renderizar y exportar muestras cuesta O(S). Total: O(N log N + S)."]
      ]
    },

    // --- ESTRUCTURAS DE DATOS (6) ---
    {
      cat: "estructuras",
      tag: "Estructura · L171–175",
      pill: "Objeto O(1)",
      pillCls: "comp-pill--const",
      title: "8. Nodo del montículo (NodoHeap)",
      ref: "class NodoHeap(dato, prioridad: float)",
      snippet: "self.dato = (nota_candidata, dur_ql, idx_nota)\nself.prioridad = prioridad; self.indice = None",
      rows: [
        ["Qué almacena", "Empaqueta la tupla musical (dato), la clave numérica de comparación (prioridad) y su posición viva en el arreglo (indice)."],
        ["Por qué mantener indice", "Cada intercambiar(i, j) actualiza heap[i].indice = i y al extraer limpia maximo.indice = None, dejando la estructura lista para decrease/increase-key en O(log G)."],
        ["Memoria", "O(1) por nodo; en el proyecto coexisten exactamente G = 7 instancias por pulso evaluado."]
      ]
    },
    {
      cat: "estructuras",
      tag: "Estructura · L161–238",
      pill: "Heap · O(G) / O(log G)",
      pillCls: "comp-pill--linear",
      title: "9. Cola de Prioridad Máxima propia (HeapMax)",
      ref: "class HeapMax · construir_heap · flotar · hundir · insertar · extraer_maximo",
      snippet: "padre=(i-1)//2 | izq=2*i+1 | der=2*i+2\nfor i in range((self.tamano // 2) - 1, -1, -1): self.hundir(i)",
      rows: [
        ["Invariante Max-Heap", "Para todo nodo i > 0 se cumple heap[padre(i)].prioridad >= heap[i].prioridad, garantizando el máximo en heap[0]."],
        ["Operaciones reales", "construir_heap usa el método bottom-up de Floyd O(G); flotar sube en inserciones O(log G); hundir repara la raíz al extraer O(log G)."],
        ["Por qué no heapq", "heapq de Python solo ofrece min-heap sobre tipos comparables sin encapsular nodos ni rastrear índices internos."]
      ]
    },
    {
      cat: "estructuras",
      tag: "Estructura · L37–582",
      pill: "7 Tablas Hash · O(1)",
      pillCls: "comp-pill--const",
      title: "10. Los 7 diccionarios (dict y defaultdict) del proyecto",
      ref: "INTERVALOS · repositorio_escalas · indice_para_la_nota... · desplazamientos · orden... · mapa_midi · acciones_por_muestra",
      snippet: "repositorio_escalas[(nota, modo)] -> list[str]\nacciones_por_muestra = defaultdict(list)  # muestra -> [('on'/'off', ch, key, vel)]",
      rows: [
        ["Catálogos O(1)", "INTERVALOS (2 modos), repositorio_escalas (24 tuplas clave), desplazamientos y orden_de_elegir_el_grado (3 intervalos)."],
        ["Traductores rápidos", "indice_para_la_nota_dentro_de_la_escala evita list.index() O(G); mapa_midi cachea los números MIDI evitando llamar a music21 N veces."],
        ["Índice temporal", "acciones_por_muestra (defaultdict) agrupa colisiones de múltiples instrumentos en la misma muestra exacta en O(1) amortizado."]
      ]
    },
    {
      cat: "estructuras",
      tag: "Estructura · L609",
      pill: "Conjunto Hash · O(E)",
      pillCls: "comp-pill--linear",
      title: "11. Conjunto matemático (set) para deduplicación temporal",
      ref: "instantes = sorted(set(acciones_por_muestra.keys()) | {num_muestras})",
      snippet: "set(acciones_por_muestra.keys()) | {num_muestras}",
      rows: [
        ["Qué resuelve", "Asegura que el borde final exacto del archivo (num_muestras) exista siempre en la línea de tiempo sin duplicarlo si una nota ya terminaba ahí."],
        ["Por qué importa", "Si la canción termina en silencio (ej. 'rest' final), el tramo hasta num_muestras igual se renderiza completo hasta cubrir duracion_s."],
        ["Complejidad", "Unión en O(E) seguida de Timsort en O(E log E), con E ≤ 8N + 1 instantes."]
      ]
    },
    {
      cat: "estructuras",
      tag: "Estructura · L424–480",
      pill: "Pila DFS · O(N)",
      pillCls: "comp-pill--linear",
      title: "12. Pila implícita de recursión + arreglo mutable in-place",
      ref: "secuencia_actual.append(...) · dfs(...) · secuencia_actual.pop()",
      snippet: "secuencia_actual.append((nota_elegida, dur_ql))\ndfs(paso + 1, sig_r3, sig_r5, sig_r7, nuevo_costo)\nsecuencia_actual.pop()",
      rows: [
        ["Dos pilas coordinadas", "La pila de llamadas de Python guarda (paso, r3, r5, r7, costo_acum) y secuencia_actual mantiene las notas elegidas en el camino activo."],
        ["Ahorro crítico de RAM", "Pasar secuencia_actual + [nota] en cada nodo gastaría O(N) por nodo visitado; con append/pop muta en O(1) y solo ejecuta .copy() cuando mejora mejor_costo."],
        ["Complejidad", "Espacio estricto O(N): nunca supera n_pasos marcos de pila."]
      ]
    },
    {
      cat: "estructuras",
      tag: "Estructura · L575–639",
      pill: "NumPy · O(S)",
      pillCls: "comp-pill--linear",
      title: "13. Vectores contiguos float32 y matriz estéreo PCM int16",
      ref: "left = np.zeros(num_muestras, dtype=np.float32) · stereo_pcm16",
      snippet: "stereo = np.column_stack((left, right))\nstereo_pcm16 = np.clip(stereo * 32767.0, -32768, 32767).astype(np.int16)",
      rows: [
        ["Diseño en memoria", "Dos vectores C contiguos de 4 bytes/muestra (float32) durante la mezcla, convertidos al final en una matriz S × 2 de 2 bytes/muestra (int16)."],
        ["Por qué float32 primero", "El sintetizador suma ondas en coma flotante [-1.0, 1.0]; convertir antes truncaría la suma polifónica de los 4 instrumentos."],
        ["Tamaño exacto", "Para 60 s (S = 2 646 000): left + right ocupan 21.17 MB temporales y el .wav final pesa exactamente 10.58 MB."]
      ]
    },

    // --- MATEMÁTICAS, MÚSICA Y AUDIO DIGITAL (6) ---
    {
      cat: "matematicas",
      tag: "Fórmula · L68–72",
      pill: "Discretización temporal",
      pillCls: "comp-pill--const",
      title: "14. Ecuaciones de Tempo (140 BPM) a cantidad de notas N",
      ref: "dedtln = 1.0 · bpm = 140.0 · seg_por_ql · total_ql · radio_de_notas",
      snippet: "seg_por_ql = 60.0 / 140.0  # 0.42857 s por negra\nN = max(1, int((duracion * 140.0 / 60.0) // 1.0))",
      rows: [
        ["Significado de dedtln", "'Duración estándar de todas las notas' = 1.0 quarter length (una negra musical ≈ 0.4286 segundos a 140 BPM)."],
        ["Rango real de N", "Con el mínimo duracion = 3 s → N = 7 notas/canal. Con duracion = 10 s → N = 23. Con el máximo duracion = 60 s → N = 140 notas/canal."],
        ["Recorte final", "Si N × 0.42857 s roza el borde, envoltorio_para_los_varios_wav recorta exactamente en duracion_s × 44100 muestras."]
      ]
    },
    {
      cat: "matematicas",
      tag: "Geometría modular · L266, L373",
      pill: "Anillo Z_7",
      pillCls: "comp-pill--const",
      title: "15. Métrica de distancia circular en el anillo Z_7",
      ref: "calcular_la_disancia_entre_dos_grado(a, b) -> min(diff, 7 - diff)",
      snippet: "diff = abs(a - b) % 7\ndist = min(diff, 7 - diff)  # rango posible: {0, 1, 2, 3}",
      rows: [
        ["Por qué es circular", "En una escala heptatónica el grado 6 (séptima, ej. B3) es vecino directo del grado 0 (tónica C3) al cerrar el ciclo."],
        ["Consecuencia clave en Backtracking", "3ª (+2) tiene dist = min(2,5) = 2; 5ª (+4) tiene dist = min(4,3) = 3; ¡y 7ª (+6) tiene dist = min(6,1) = 1! Por eso el DFS explora 7ª primero."],
        ["Diámetro máximo", "Ningún par de notas en una escala de 7 grados puede estar a más de 3 pasos circulares."]
      ]
    },
    {
      cat: "matematicas",
      tag: "Optimización · L272, L461",
      pill: "Función de costo",
      pillCls: "comp-pill--linear",
      title: "16. Función objetivo del Voraz vs. desempate de Backtracking",
      ref: "prioridad = -(dist_objetivo + 0.5 * dist_anterior) · (-orden_de_elegir_el_grado)",
      snippet: "Voraz: max -(d_obj + 0.5*d_ant)\nDFS sort: (dist, -orden[etiq], etiq, grado_cand)",
      rows: [
        ["Truco del signo negativo", "Queremos minimizar penalización (d_obj + 0.5·d_ant ≥ 0). Al multiplicarla por -1, el costo 0 se vuelve prioridad 0.0 (máxima en HeapMax)."],
        ["Rol de factor_paso = 0.5", "Una desviación de 1 grado respecto al acorde pesa el doble (1.0) que moverse 1 grado desde la nota anterior (0.5): prioriza armonía sobre inercia."],
        ["Desempate en Backtracking", "orden_de_elegir_el_grado = {'3a':1, '5a':2, '7a':3}; al ordenar con signo negativo (-orden), ante igual distancia prefiere el intervalo mayor."]
      ]
    },
    {
      cat: "matematicas",
      tag: "Armonía · L240–243, L361",
      pill: "Progresiones clásicas",
      pillCls: "comp-pill--const",
      title: "17. Codificación numérica de La Folía y Quintas Descendentes",
      ref: "progresion_folia = [0,4,0,6,2,6,0,4] · progresion_quintas = [0,3,6,2,5,1,4]",
      snippet: "Folía (mayor):   I - V - I - VII - III - VII - I - V\nQuintas (menor): i - iv - VII - III - VI - ii° - V",
      rows: [
        ["Qué representan los números", "Son índices 0..6 sobre escala_actual: 0=tónica (I), 2=mediante (III), 3=subdominante (IV), 4=dominante (V), 6=séptimo grado (VII)."],
        ["Ciclo periódico", "Se indexan con paso_idx % len(progresion) (ciclo de 8 pulsos en mayor y de 7 pulsos en menor)."],
        ["Intervalos en Backtracking", "Sumar +2, +4 o +6 módulo 7 sobre grado_base equivale exactamente a saltar a la 3ª, 5ª o 7ª diatónica dentro de la escala."]
      ]
    },
    {
      cat: "matematicas",
      tag: "Protocolo MIDI · L150–155, L545",
      pill: "General MIDI 1.0",
      pillCls: "comp-pill--const",
      title: "18. Mensajes MIDI en hexadecimal (0xC0) y los 4 timbres",
      ref: "synth.process_midi_message(channel, 0xC0, program, 0)",
      snippet: "ch 0: prog 35 (Fretless Bass)     | ch 1: prog 26 (Jazz Guitar)\nch 2: prog 14 (Tubular Bells)     | ch 3: prog 114 (Steel Drums)",
      rows: [
        ["Qué es 0xC0", "En la especificación MIDI, el byte de estado 0xC0 (192 decimal) es el comando Program Change: cambia el instrumento (patch) del canal."],
        ["Velocidad fija 70", "velocity = 70 (en rango MIDI 0..127) corresponde a una dinámica mezzoforte equilibrada para que ningún canal sature la mezcla."],
        ["Fórmula nota → MIDI", "C3 = 48, C#3 = 49, ..., B3 = 59. La frecuencia acústica asociada es f = 440 × 2^((midi - 69)/12) Hz."]
      ]
    },
    {
      cat: "matematicas",
      tag: "DSP / Audio · L539, L575–639",
      pill: "44.1 kHz · PCM 16-bit",
      pillCls: "comp-pill--linear",
      title: "19. Teorema de Nyquist, cuantización PCM 16-bit y clipping",
      ref: "sample_rate = 44100 · np.clip(stereo * 32767.0, -32768, 32767).astype(np.int16)",
      snippet: "f_Nyquist = 44100 / 2 = 22 050 Hz (cubre todo el oído humano 20 Hz..20 kHz)",
      rows: [
        ["Por qué 44 100 Hz", "Estándar de calidad CD: por el teorema de muestreo de Nyquist-Shannon reconstruye sin aliasing frecuencias de hasta 22.05 kHz."],
        ["Escalado × 32767", "Un entero con signo de 16 bits abarca [-32768, 32767] (~96 dB de rango dinámico). Multiplicar [-1.0, 1.0] por 32767 aprovecha toda la resolución."],
        ["Por qué np.clip es vital", "Sin np.clip, si 4 instrumentos suman > 1.0, el casteo a int16 sufriría desbordamiento entero (wrap-around), produciendo chasquidos digitales severos."]
      ]
    },

    // --- COMPLEJIDAD AL MICROSCOPIO (5) ---
    {
      cat: "complejidad",
      tag: "Análisis exacto · TXT L12–14",
      pill: "T(N) = 40N - 3",
      pillCls: "comp-pill--linear",
      title: "20. De dónde sale exactamente 40N - 3 en Movimiento Browniano",
      ref: "ANALISIS_DE_COMPLEJIDAD.txt: 5 + 4(3N - 2) + 4N + 3N",
      snippet: "Cálculo previo (bpm, ql, radio): 5 ops\n4 llamadas brownianas: 4(3N - 2) + comprensiones de canal y aislados → Θ(N)",
      rows: [
        ["Desglose paso a paso", "5 asignaciones aritméticas iniciales + 4 ejecuciones del bucle de (N - 1) pasos gaussianos + comprensiones de lista de longitud N para canal_* y valors_aislados_*."],
        ["Comportamiento asintótico", "Tanto el mejor como el peor y el caso promedio ejecutan exactamente el mismo número de iteraciones: es Θ(N) estricto."],
        ["Con N = 140 (60 s)", "Apenas ~5 597 operaciones elementales (< 1 milisegundo en Python)."]
      ]
    },
    {
      cat: "complejidad",
      tag: "Análisis exacto · TXT L21–24",
      pill: "T(N) ≈ 240N",
      pillCls: "comp-pill--linear",
      title: "21. De dónde sale 240N en el Algoritmo Voraz con HeapMax",
      ref: "ANALISIS_DE_COMPLEJIDAD.txt: 2·2N + N(12G + 5 log_2 G + 6) con G = 7",
      snippet: "Con G = 7 fijo: 12(7) + 5·log2(7) + 6 ≈ 84 + 14 + 6 = 104 ops/paso × 2 canales + voces complementarias ≈ 240N",
      rows: [
        ["Por qué se evalúa 2 veces", "algoritmo_voraz_para_aproximar se ejecuta para guitarra y para campana; luego la función complementaria recorre N pasos para bajo y steel drums."],
        ["Lección clave de análisis", "Una cota con log G NO implica O(N log N) cuando G no crece con la entrada: como la escala musical siempre tiene 7 notas, G es O(1)."],
        ["Con N = 140 (60 s)", "~33 600 operaciones elementales: instantáneo en cualquier CPU."]
      ]
    },
    {
      cat: "complejidad",
      tag: "Demostración · L217–219",
      pill: "Floyd · O(G)",
      pillCls: "comp-pill--const",
      title: "22. Por qué construir_heap() cuesta O(G) y no O(G log G)",
      ref: "for i in range((self.tamano // 2) - 1, -1, -1): self.hundir(i)",
      snippet: "Suma de alturas en árbol binario completo: ∑ (G / 2^(h+1)) · h ≤ G · ∑ (h / 2^(h+1)) = O(G)",
      rows: [
        ["Idea clave", "La mitad de los nodos (hojas, índices G//2 .. G-1) ya cumplen ser heaps triviales y ni siquiera se tocan; solo se hunden los nodos internos."],
        ["Con G = 7 nodos", "(7 // 2) - 1 = 2: construir_heap() únicamente llama a hundir(2), hundir(1) y hundir(0) (¡solo 3 llamadas en total!)."],
        ["Extracción posterior", "extraer_maximo() intercambia la raíz con el último y ejecuta 1 solo hundir(0) de altura máxima ⌊log₂ 6⌋ = 2."]
      ]
    },
    {
      cat: "complejidad",
      tag: "Análisis exacto · L428–482, TXT L52",
      pill: "Θ(3^N) vs ≤ 4000",
      pillCls: "comp-pill--exp",
      title: "23. Cota teórica Θ(3^N) vs. comportamiento real con poda y tope",
      ref: "poda_de_backtracking(..., max_nodos=4000)",
      snippet: "Sin poda (N=23): 3^23 = 94 143 178 827 hojas\nSin poda (N=140): 3^140 ≈ 4.81 × 10^66 hojas (más que átomos en una galaxia)",
      rows: [
        ["Qué reduce el árbol antes del tope", "1) Turnos mod 2, 3 y 4 saltan pasos sin ramificar; 2) r3=2, r5=2 y r7=1 reducen hijos válidos de 3 a 1; 3) Ordenar primero 7a (+1) halla rápido una cota baja y poda ramas caras."],
        ["Qué garantiza max_nodos = 4000", "Actúa como interruptor de tiempo real (anytime algorithm): devuelve la mejor secuencia hallada hasta el nodo 4 000 sin colgar jamás el programa."],
        ["Red de seguridad (L484–491)", "Si duracion fuera enorme y ni siquiera completara la 1ª hoja en 4 000 nodos, rellena determinísticamente con 3a y 'rest'."]
      ]
    },
    {
      cat: "complejidad",
      tag: "Memoria · L575–639",
      pill: "Espacio O(N + S)",
      pillCls: "comp-pill--nlogn",
      title: "24. Análisis espacial completo: RAM y almacenamiento",
      ref: "Listas O(N) + Diccionarios O(1)/O(N) + Buffers O(S)",
      snippet: "Pico RAM (60 s): left(10.58 MB) + right(10.58 MB) + stereo(21.17 MB) + pcm16(10.58 MB) ≈ 53 MB pico",
      rows: [
        ["Fase simbólica (notas)", "Para 60 s (N = 140), todas las listas de notas, tuplas, pila DFS y eventos ocupan menos de 150 KB en total."],
        ["Fase acústica (audio)", "Domina por completo el término S = 44 100 × duracion_s porque cada segundo exige 44 100 muestras por canal."],
        ["Reutilización secuencial", "Como envoltorio_para_los_varios_wav es una función local, Python libera los buffers de un .wav al terminar antes de sintetizar el siguiente."]
      ]
    },

    // --- RADIOGRAFÍA DEL CÓDIGO (5) ---
    {
      cat: "radiografia",
      tag: "Mapa del archivo · 679 líneas",
      pill: "11 Bloques",
      pillCls: "comp-pill--const",
      title: "25. Mapa estructural completo de PROYECTO_FINAL_MUSICA_ESTOCASTICA.py",
      ref: "Recorrido exacto de la línea 1 a la 679",
      snippet: "L1–7 Imports | L8–31 Entradas | L33–64 Escalas | L66–146 Browniano | L148–155 Canales Bruto\nL157–340 HeapMax + Voraz | L343–520 Backtracking | L524–640 Envoltorio WAV | L643–679 Ejecución x3",
      rows: [
        ["L1–64 (Configuración)", "Importaciones, validación estricta con raise ValueError y preconstrucción de las 24 escalas en octava 3."],
        ["L66–340 (Azar y Voraz)", "Cálculo de N desde BPM=140, 4 generadores brownianos, clases NodoHeap/HeapMax, aproximación voraz y voces en 3ª/rest."],
        ["L343–679 (DFS y Audio)", "Función autocontenida poda_de_backtracking con 4 subfunciones anidadas, motor envoltorio_para_los_varios_wav y las 3 llamadas finales."]
      ]
    },
    {
      cat: "radiografia",
      tag: "Catálogo de firmas · Código real",
      pill: "16 Funciones/Métodos",
      pillCls: "comp-pill--nlogn",
      title: "26. Todas las funciones y métodos definidos en el proyecto",
      ref: "PROYECTO_FINAL_MUSICA_ESTOCASTICA.py",
      snippet: "escala_por_intervalos · construir_repositorio_escalas · movimiento_browniano_(x4)\npadre · izquierdo · derecho · HeapMax.(intercambiar, flotar, hundir, construir_heap, insertar, extraer_maximo)\nalgoritmo_voraz_para_aproximar · las_notas_de_bajo... · poda_de_backtracking · envoltorio_para_los_varios_wav",
      rows: [
        ["Subfunciones clausuradas en DFS", "Dentro de poda_de_backtracking viven 5 funciones internas con acceso léxico a escala y secuencia_base (calcular_la_disancia..., obtener_grado..., en_que_orden..., reestricciones..., dfs)."],
        ["Uso de nonlocal (L429)", "dfs declara nonlocal mejor_costo, mejor_secuencia, nodos_visitados, limite_alcanzado para actualizar cotas sin variables globales."],
        ["Polimorfismo defensivo (L377–389)", "obtener_grado_y_duracion soporta tanto enteros puros (valors_aislados_*) como tuplas ('E3', 1.0) o (2, None)."]
      ]
    },
    {
      cat: "radiografia",
      tag: "Detalles finos · Auditoría",
      pill: "4 Curiosidades Reales",
      pillCls: "comp-pill--exp",
      title: "27. Detalles sutiles de Python en el código (oro para preguntas difíciles)",
      ref: "L77, L88, L50, L409 de PROYECTO_FINAL_MUSICA_ESTOCASTICA.py",
      snippet: "1) int(x*100) % 6 -> índices 0..5   | 2) inicio=random.uniform(-1,1) en def\n3) base_midi + (midi % 12) -> C3..B3 | 4) max_septimas: int = 1 (L409)",
      rows: [
        ["Módulo 6 en Browniano (L88)", "int(x*100) % 6 produce grados 0..5 (6 de las 7 notas) en el aleatorio bruto; luego Voraz y Backtracking sí operan módulo 7 completo (0..6)."],
        ["Valor por defecto en def (L77)", "inicio=random.uniform(-1.0, 1.0) se evalúa al definir cada función. Como hay 4 funciones separadas y cada una se llama 1 sola vez, las 4 pistas tienen semillas iniciales distintas."],
        ["Plegado de octava (L50) y max_7a (L409)", "midi_fijado mantiene todas las notas dentro de MIDI 48..59 (octava 3 cerrada); y en L409 max_septimas vale 1 aunque README mencione dos."]
      ]
    },
    {
      cat: "radiografia",
      tag: "Comportamiento · L257–284",
      pill: "Determinismo armónico",
      pillCls: "comp-pill--linear",
      title: "28. Qué toma exactamente el Voraz de la secuencia aleatoria base",
      ref: "for paso_idx, (simbolo, dur_ql) in enumerate(secuencia_base)",
      snippet: "if simbolo == 'rest' or simbolo is None: resultado.append((simbolo, dur_ql)); continue",
      rows: [
        ["Cómo funciona en el código", "secuencia_base define cuántos pulsos N hay, la duración dur_ql de cada pulso y conserva cualquier silencio; en los pulsos activos evalúa los 7 grados frente a progresion[paso_idx] y grado_actual."],
        ["Efecto musical resultante", "Guitarra y campana convergen a la conducción de voces ideal de La Folía o Quintas, contrastando de forma nítida con el caos de aleatorio_bruto.wav y las variaciones de backtracking.wav."]
      ]
    },
    {
      cat: "radiografia",
      tag: "Motor interno · meltysynth.py",
      pill: "3 917 líneas Python",
      pillCls: "comp-pill--nlogn",
      title: "29. Qué hace meltysynth.py por dentro cuando llamamos a render()",
      ref: "meltysynth.py: SoundFont · Synthesizer · _VoiceCollection · _Oscillator · _BiQuadFilter",
      snippet: "note_on -> _preset_lookup[(bank<<16)|patch] -> _RegionPair -> _Voice.start()\nrender -> _render_block (bloques internos) -> ADSR + LFO + filtro pasa-bajos -> mezcla estéreo",
      rows: [
        ["Carga SF2 (L1662)", "SoundFont.from_file lee binariamente los chunks RIFF del archivo FluidR3_GM.sf2: muestras PCM reales grabadas de instrumentos y zonas de velocidad/tecla."],
        ["Cadena DSP de cada voz", "Cada nota activa (_Voice) interpola la onda grabada (_Oscillator), la moldea con envolvente de volumen ADSR (_VolumeEnvelope), vibrato (_Lfo), filtro resonante (_BiQuadFilter) y paneo estéreo."],
        ["Render por bloques (L3461)", "Aunque pidamos un tramo arbitrario tramo = t_sig - t_act, internamente sintetiza en bloques fijos (_block_size = 64 muestras) y copia el remanente exacto."]
      ]
    },

    // --- LIBRERÍAS Y RECURSOS (5) ---
    {
      cat: "librerias",
      tag: "Librería externa · L4",
      pill: "music21",
      pillCls: "comp-pill--const",
      title: "30. music21 (módulos pitch e interval)",
      ref: "from music21 import interval, pitch",
      rows: [
        ["De dónde sale", "Toolkit académico del MIT para musicología asistida por computadora."],
        ["Uso exacto en el código", "pitch.Pitch(f'{tonica}{octava}'), interval.Interval(semitonos).transposePitch(p_base) y conversión de nombre ('C#3') a entero MIDI (49)."],
        ["Dónde se aísla su costo", "Solo se invoca al inicio (escalas y mapa_midi); nunca dentro de los bucles críticos de Voraz, DFS ni renderizado de muestras."]
      ]
    },
    {
      cat: "librerias",
      tag: "Módulo local + Asset · L3, L645",
      pill: "SoundFont GM",
      pillCls: "comp-pill--nlogn",
      title: "31. meltysynth.py + Banco FluidR3_GM.sf2",
      ref: "import meltysynth as ms · ms.SoundFont.from_file('assets/FluidR3_GM.sf2')",
      rows: [
        ["De dónde sale", "Port en Python puro del sintetizador MeltySynth (original de Sinshu) junto al banco estándar abierto FluidR3 General MIDI."],
        ["Ventaja decisiva", "Cero compilación C/C++ y cero configuración de dispositivos MIDI virtuales en Windows/Linux/macOS: produce audio idéntico en cualquier máquina."],
        ["Reutilización eficiente", "FluidR3_GM.sf2 (~141 MB) se carga en RAM una sola vez en L645 (sf2) y se pasa por referencia a las 3 llamadas de síntesis."]
      ]
    },
    {
      cat: "librerias",
      tag: "Librería científica · L5",
      pill: "NumPy",
      pillCls: "comp-pill--linear",
      title: "32. numpy (buffers y vectorización PCM)",
      ref: "np.zeros · np.asarray · np.column_stack · np.clip · .astype(np.int16)",
      rows: [
        ["De dónde sale", "Librería base de cálculo numérico en C para Python."],
        ["Uso exacto en el código", "Reserva los buffers left/right en float32, los une en matriz estéreo (S, 2) y vectoriza la multiplicación ×32767, saturación y conversión a int16."],
        ["Impacto en rendimiento", "Hacer el escalado y clip de 2.6 millones de muestras en un bucle Python tardaría segundos; vectorizado en NumPy toma pocos milisegundos."]
      ]
    },
    {
      cat: "librerias",
      tag: "Librería científica · L6",
      pill: "SciPy I/O",
      pillCls: "comp-pill--linear",
      title: "33. scipy.io.wavfile",
      ref: "wavfile.write(ruta_wav, settings.sample_rate, stereo_pcm16)",
      rows: [
        ["De dónde sale", "Submódulo de entrada/salida de señales de audio de SciPy."],
        ["Qué escribe en disco", "Construye la cabecera binaria RIFF/WAVE de 44 bytes (formato PCM=1, 2 canales, 44 100 Hz, 176 400 bytes/s, 16 bits) seguida del volcado crudo de stereo_pcm16."]
      ]
    },
    {
      cat: "librerias",
      tag: "Biblioteca estándar · L1–2",
      pill: "Python Stdlib",
      pillCls: "comp-pill--const",
      title: "34. random y collections.defaultdict",
      ref: "random.uniform(-1.0, 1.0) · random.gauss(0.0, paso) · defaultdict(list)",
      rows: [
        ["Generador pseudoaleatorio", "Usa Mersenne Twister (período 2^19937 - 1) con transformación gaussiana para simular incrementos brownianos continuos."],
        ["defaultdict(list)", "Crea automáticamente una lista vacía al acceder por primera vez a un índice de muestra m_on o m_off, simplificando el código de encolado."]
      ]
    },

    // --- DEFENSA / PREGUNTAS DE EXAMEN (6) ---
    {
      cat: "defensa",
      tag: "Pregunta de jurado #1",
      pill: "Estructuras",
      pillCls: "comp-pill--linear",
      title: "35. ¿Por qué implementaron HeapMax desde cero en vez de usar heapq o max()?",
      ref: "Defensa de diseño · L161–238",
      rows: [
        ["Respuesta directa", "1) En un curso de Algoritmos y Estructuras de Datos demuestra dominio real de árboles binarios en arreglos (flotar, hundir y construcción de Floyd); 2) heapq de Python solo soporta min-heap y no mantiene nodo.indice dentro de cada elemento."],
        ["Escalabilidad de diseño", "Si se amplía a escalas microtonales, acordes extendidos o miles de candidatos, HeapMax mantiene extracción O(log G) y soporte directo para actualizar prioridades por índice."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #2",
      pill: "Complejidad",
      pillCls: "comp-pill--const",
      title: "36. Si usan una cola de prioridad logarítmica, ¿por qué el Voraz es O(N) y no O(N log N)?",
      ref: "Defensa matemática · ANALISIS_DE_COMPLEJIDAD.txt L21–24",
      rows: [
        ["Respuesta directa", "Porque el heap NO contiene las N notas de la canción: contiene únicamente los G = 7 grados candidatos de la escala en el pulso actual."],
        ["Demostración en 1 línea", "T(N) = N · O(G + log G). Como G = 7 es una constante independiente de la duración en segundos, G + log₂(7) = O(1), y por tanto N · O(1) = O(N)."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #3",
      pill: "Backtracking",
      pillCls: "comp-pill--exp",
      title: "37. Si Backtracking es O(3^N), ¿cómo no explota al pedir 60 segundos (N = 140)?",
      ref: "Defensa de poda · L434–491",
      rows: [
        ["Respuesta directa", "Por cuatro barreras combinadas: 1) Ordenamos primero el candidato de menor costo (7a cuesta 1), encontrando enseguida una hoja de costo bajo; 2) Podamos cualquier rama con costo_acum >= mejor_costo; 3) Los silencios por turno y rachas reducen la ramificación; 4) Ponemos un tope duro max_nodos = 4000 con respaldo determinista."],
        ["Resultado práctico", "Pasa de 3^140 (~10^66) operaciones imposibles a un máximo garantizado de 4 000 nodos visitados por instrumento (< 0.05 s)."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #4",
      pill: "Síntesis MIDI",
      pillCls: "comp-pill--nlogn",
      title: "38. ¿Por qué en el renderizado ordenan 'off' antes que 'on' en la misma muestra?",
      ref: "Defensa de ingeniería de audio · L615–625",
      rows: [
        ["Respuesta directa", "Porque las notas son contiguas: el offset_s de la nota k coincide exactamente con el onset_s de la nota k+1. Si la nota se repite (ej. C3 seguida de C3) y ejecutáramos note_on antes que note_off en ese instante, el note_off mataría inmediatamente a la nueva nota dejando silencio."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #5",
      pill: "Comparación musical",
      pillCls: "comp-pill--linear",
      title: "39. ¿Qué diferencia audible y algorítmica hay entre los 3 archivos .wav?",
      ref: "aleatorio_bruto.wav vs voraz.wav vs backtracking.wav",
      rows: [
        ["aleatorio_bruto.wav", "4 canales tocando todo el tiempo sin silencios ni relación armónica entre sí (caminatas brownianas puras en grados 0..5)."],
        ["voraz.wav", "Sigue fielmente la progresión clásica (La Folía o Quintas) en guitarra y campana, con bajo y percusión respondiendo en terceras cada 2 tiempos."],
        ["backtracking.wav", "Transforma la secuencia aleatoria original de cada canal en saltos controlados de 3ª, 5ª y 7ª sin repetir rachas monótonas y escalonando la entrada de los 4 instrumentos (mod 1..4)."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #6",
      pill: "Evolución del proyecto",
      pillCls: "comp-pill--const",
      title: "40. ¿Cómo evolucionó desde la propuesta inicial hasta este sistema completo?",
      ref: "propuesta/propuesta.pdf → PROYECTO_FINAL_MUSICA_ESTOCASTICA.py",
      rows: [
        ["Respuesta directa", "La propuesta partía del interés didáctico en construir escalas musicales por semitonos. Al desarrollarlo decidimos llevar esas escalas mucho más lejos: no solo mostrarlas en texto, sino sintetizar música polifónica real y comparar experimentalmente el azar frente a dos paradigmas centrales del curso (Voraz con Heaps y Backtracking con Poda)."]
      ]
    }
  ];

  let currentSlide = 0;
  let currentStep = 0;
  let autoTimer = null;
  let currentHcTab = "all";
  let currentHcQuery = "";
  let activeAudio = null;
  let activeAudioBtn = null;

  function maxStepsFor(index) {
    return Number(slides[index].dataset.steps || 0);
  }

  function fitStage() {
    const padX = 16;
    const padY = 66;
    const availW = Math.max(320, window.innerWidth - padX);
    const availH = Math.max(240, window.innerHeight - padY);
    const scale = Math.min(availW / STAGE_W, availH / STAGE_H);
    stage.style.transform = "scale(" + scale.toFixed(4) + ")";
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function highlightCode(containerId, badgeId, activeLine, fillId, step, maxSteps) {
    const lines = document.querySelectorAll("#" + containerId + " .code-line");
    lines.forEach(function (el) {
      el.classList.toggle("is-active", Number(el.dataset.line) === activeLine);
    });
    const badge = document.getElementById(badgeId);
    if (badge) {
      badge.textContent = "Línea " + String(activeLine).padStart(2, "0");
    }
    if (fillId && maxSteps > 0) {
      const fillEl = document.getElementById(fillId);
      if (fillEl) {
        fillEl.style.width = Math.round((step / maxSteps) * 100) + "%";
      }
    }
  }

  function renderVars(containerId, vars) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = vars.map(function (v) {
      return (
        '<div class="var-chip' + (v.changed ? " is-changed" : "") + '">' +
        '<span class="var-k">' + v.k + "</span>" +
        '<span class="var-v">' + v.v + "</span>" +
        "</div>"
      );
    }).join("");
  }

  function renderExplain(elId, html) {
    const el = document.getElementById(elId);
    if (el) el.innerHTML = html;
  }

  // =========================================================
  // REPRODUCTOR DE DEMOS WAV EN VIVO (../proyecto_final/*.wav)
  // =========================================================
  const closingEqEl = document.getElementById("closing-eq");

  function stopWavAudio() {
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio = null;
    }
    if (activeAudioBtn) {
      const baseName = activeAudioBtn.dataset.wav.split("/").pop();
      activeAudioBtn.textContent = "▶ " + baseName;
      activeAudioBtn.classList.remove("is-playing");
      activeAudioBtn = null;
    }
    if (closingEqEl) {
      closingEqEl.classList.remove("is-playing");
    }
  }

  function toggleWavAudio(btn) {
    const src = btn.dataset.wav;
    const baseName = src.split("/").pop();
    if (activeAudioBtn === btn && activeAudio) {
      stopWavAudio();
      if (audioStatusEl) audioStatusEl.hidden = true;
      return;
    }
    stopWavAudio();
    const audio = new Audio(src);
    activeAudio = audio;
    activeAudioBtn = btn;
    btn.classList.add("is-playing");
    btn.textContent = "⏹ " + baseName;
    if (closingEqEl) {
      closingEqEl.classList.add("is-playing");
    }
    if (audioStatusEl) {
      audioStatusEl.hidden = false;
      audioStatusEl.textContent = "Reproduciendo " + baseName + "...";
    }
    audio.addEventListener("ended", function () {
      stopWavAudio();
      if (audioStatusEl) audioStatusEl.hidden = true;
    });
    audio.addEventListener("error", function () {
      stopWavAudio();
      if (audioStatusEl) {
        audioStatusEl.hidden = false;
        audioStatusEl.textContent = "No se encontró " + src + " (mantén /presentacion junto a /proyecto_final para reproducir el audio).";
      }
    });
    audio.play().catch(function () {
      stopWavAudio();
    });
  }

  document.querySelectorAll("[data-wav]").forEach(function (btn) {
    btn.addEventListener("click", function (ev) {
      ev.stopPropagation();
      toggleWavAudio(btn);
    });
  });

  // =========================================================
  // CONTROL DE MINI-ANIMACIÓN AUTOMÁTICA (▶ Animar / Tecla P)
  // =========================================================
  function updateAnimButtons() {
    const activeSlide = slides[currentSlide];
    const max = maxStepsFor(currentSlide);
    const isPlaying = autoTimer !== null;

    document.querySelectorAll("[data-anim-toggle]").forEach(function (btn) {
      const inCurrent = activeSlide && activeSlide.contains(btn);
      const playingHere = isPlaying && inCurrent;
      btn.classList.toggle("is-playing", playingHere);
      if (playingHere) {
        btn.textContent = "⏸ Pausar";
      } else if (inCurrent && max > 0 && currentStep >= max) {
        btn.textContent = "↺ Repetir";
      } else {
        btn.textContent = "▶ Animar";
      }
    });
  }

  function stopAutoPlay() {
    if (autoTimer !== null) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
    updateAnimButtons();
  }

  function startAutoPlay() {
    const max = maxStepsFor(currentSlide);
    if (max === 0) return;

    stopAutoPlay();

    if (currentStep >= max) {
      currentStep = 0;
      renderCurrentState();
    }
    if (currentStep === 0) {
      currentStep = 1;
      renderCurrentState();
    }

    const renderer = slides[currentSlide].dataset.renderer;
    const delayMs = renderer === "flow" ? 1500 : 1850;

    autoTimer = setInterval(function () {
      const limit = maxStepsFor(currentSlide);
      if (currentStep < limit) {
        currentStep += 1;
        renderCurrentState();
        if (currentStep >= limit) {
          stopAutoPlay();
        }
      } else {
        stopAutoPlay();
      }
    }, delayMs);

    updateAnimButtons();
  }

  function toggleAutoPlay() {
    if (autoTimer !== null) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  }

  // =========================================================
  // MOTOR GENÉRICO DE REVELADO PROGRESIVO (data-reveal)
  // =========================================================
  function renderRevealSlide(slideEl, step) {
    const items = slideEl.querySelectorAll("[data-reveal]");
    items.forEach(function (item) {
      const target = Number(item.dataset.reveal);
      item.classList.toggle("is-revealed", target <= step);
      item.classList.toggle("is-current", step > 0 && target === step);
    });
  }

  // =========================================================
  // DIAPOSITIVA 5: FLUJO GENERAL ANIMADO
  // =========================================================
  const FLOW_CAPTIONS = [
    "Presiona avanzar o ▶ Animar para recorrer las 5 etapas y ver cómo escala cada una.",
    "Etapa 1 — Constante O(1): valida entradas y precalcula 24 escalas (siempre 168 ops).",
    "Etapa 2 — Lineal O(N): el movimiento browniano genera N notas por cada uno de los 4 canales.",
    "Etapa 3 — Lineal O(N): HeapMax siempre tiene G = 7 candidatos, así que el costo por nota es constante.",
    "Etapa 4 — Exponencial O(3^N) acotada: prueba 3a/5a/7a, poda costos altos y se frena en 4 000 nodos.",
    "Etapa 5 — O(N log N + S): ordena instantes MIDI con Timsort y renderiza las S muestras del .wav."
  ];

  function renderFlowStep(step) {
    const nodes = document.querySelectorAll("[data-flow-step]");
    const conns = document.querySelectorAll("[data-flow-conn]");
    nodes.forEach(function (node) {
      const s = Number(node.dataset.flowStep);
      node.classList.toggle("is-revealed", s <= step);
      node.classList.toggle("is-current", s === step);
    });
    conns.forEach(function (conn) {
      const s = Number(conn.dataset.flowConn);
      conn.classList.toggle("is-revealed", s <= step);
      conn.classList.toggle("is-current", s === step);
    });
    const cap = document.getElementById("flow-caption");
    if (cap) {
      cap.textContent = FLOW_CAPTIONS[step] || FLOW_CAPTIONS[0];
    }
  }

  // =========================================================
  // DIAPOSITIVA 12: TRAZA 1 — MOVIMIENTO BROWNIANO
  // =========================================================
  const SCALE_C = ["C3", "D3", "E3", "F3", "G3", "A3", "B3"];
  const BROWNIAN_STEPS = [
    {
      line: 1,
      formula: "inicio = 0.14 · esperando conversión",
      note: "Partimos de un valor decimal inicial x₀ = 0.14. Aún no lo traducimos a nota musical.",
      explain: "<strong>Qué pasa aquí:</strong> se guarda el punto inicial <code>0.14</code> como punto de partida de la caminata.",
      points: [{ label: "x₀", val: 0.14, jump: "", deg: 2, nota: "E3" }],
      visibleCount: 0,
      activeDeg: -1,
      vars: [
        { k: "actual", v: "0.14", changed: true },
        { k: "int(x*100)", v: "—", changed: false },
        { k: "idx (% 6)", v: "—", changed: false },
        { k: "nota", v: "—", changed: false }
      ]
    },
    {
      line: 7,
      formula: "0.14 × 100 = 14 → 14 ÷ 6 sobra 2 → E3",
      note: "Convertimos 0.14 a entero (14). El residuo de 14 ÷ 6 es 2, así que elegimos escala[2] = 'E3'.",
      explain: "<strong>Cálculo exacto:</strong> <code>0.14 × 100 = 14</code> → <code>14 % 6 = 2</code> → se agrega <code>('E3', 1.0)</code>.",
      points: [{ label: "x₀", val: 0.14, jump: "", deg: 2, nota: "E3" }],
      visibleCount: 1,
      activeDeg: 2,
      vars: [
        { k: "actual", v: "0.14", changed: false },
        { k: "int(x*100)", v: "14", changed: true },
        { k: "idx (% 6)", v: "2", changed: true },
        { k: "nota", v: "'E3'", changed: true }
      ]
    },
    {
      line: 4,
      formula: "0.14 + 0.71 = 0.85 → 85 % 6 = 1 → D3",
      note: "El siguiente valor NO es al azar puro: parte de 0.14 y suma +0.71 = 0.85 → residuo 1 ('D3').",
      explain: "<strong>Salto con memoria:</strong> <code>0.14 + 0.71 = 0.85</code> → <code>85 % 6 = 1</code> → nota vecina <code>'D3'</code>.",
      points: [
        { label: "x₀", val: 0.14, jump: "", deg: 2, nota: "E3" },
        { label: "x₁", val: 0.85, jump: "+0.71", deg: 1, nota: "D3" }
      ],
      visibleCount: 2,
      activeDeg: 1,
      vars: [
        { k: "actual", v: "0.85 (+0.71)", changed: true },
        { k: "int(x*100)", v: "85", changed: true },
        { k: "idx (% 6)", v: "1", changed: true },
        { k: "nota", v: "'D3'", changed: true }
      ]
    },
    {
      line: 4,
      formula: "0.85 - 0.32 = 0.53 → 53 % 6 = 5 → A3",
      note: "Ahora suma un salto negativo (-0.32): baja de 0.85 a 0.53 → 53 ÷ 6 sobra 5 ('A3').",
      explain: "<strong>Bajada suave:</strong> <code>0.85 - 0.32 = 0.53</code> → <code>53 % 6 = 5</code> → se guarda <code>'A3'</code>.",
      points: [
        { label: "x₀", val: 0.14, jump: "", deg: 2, nota: "E3" },
        { label: "x₁", val: 0.85, jump: "+0.71", deg: 1, nota: "D3" },
        { label: "x₂", val: 0.53, jump: "-0.32", deg: 5, nota: "A3" }
      ],
      visibleCount: 3,
      activeDeg: 5,
      vars: [
        { k: "actual", v: "0.53 (-0.32)", changed: true },
        { k: "int(x*100)", v: "53", changed: true },
        { k: "idx (% 6)", v: "5", changed: true },
        { k: "nota", v: "'A3'", changed: true }
      ]
    },
    {
      line: 7,
      formula: "0.53 + 0.51 = 1.04 → 104 % 6 = 2 → E3",
      note: "Último salto (+0.51 → 1.04): 104 ÷ 6 sobra 2 ('E3'). Ya tenemos 4 notas listas para sonar.",
      explain: "<strong>Cierre del canal:</strong> <code>104 % 6 = 2</code> → <code>('E3', 1.0)</code> completa la secuencia base.",
      points: [
        { label: "x₀", val: 0.14, jump: "", deg: 2, nota: "E3" },
        { label: "x₁", val: 0.85, jump: "+0.71", deg: 1, nota: "D3" },
        { label: "x₂", val: 0.53, jump: "-0.32", deg: 5, nota: "A3" },
        { label: "x₃", val: 1.04, jump: "+0.51", deg: 2, nota: "E3" }
      ],
      visibleCount: 4,
      activeDeg: 2,
      vars: [
        { k: "actual", v: "1.04 (+0.51)", changed: true },
        { k: "int(x*100)", v: "104", changed: true },
        { k: "idx (% 6)", v: "2", changed: true },
        { k: "nota", v: "'E3'", changed: true }
      ]
    }
  ];

  function renderTraceBrownian(step) {
    const data = BROWNIAN_STEPS[step];
    document.getElementById("b-step-badge").textContent = "Paso " + step + " / 4";
    document.getElementById("b-formula").textContent = data.formula;
    document.getElementById("b-note").textContent = data.note;
    highlightCode("b-code", "b-line-badge", data.line, "b-ide-fill", step, 4);
    renderVars("b-vars", data.vars);
    renderExplain("b-explain", data.explain);

    const svg = document.getElementById("b-svg");
    const xs = [100, 240, 380, 520];
    const mapY = function (v) { return 140 - v * 92; };

    let html = "";
    html += '<line x1="48" y1="140" x2="585" y2="140" stroke="#CBD5E1" stroke-width="2" />';
    html += '<text x="16" y="144" fill="#64748B" font-size="13" font-weight="700">0.0</text>';
    html += '<line x1="48" y1="48" x2="585" y2="48" stroke="#E2E8F0" stroke-width="1.5" stroke-dasharray="4 4" />';
    html += '<text x="16" y="52" fill="#64748B" font-size="13" font-weight="700">1.0</text>';

    if (data.visibleCount > 1) {
      for (let i = 1; i < data.visibleCount; i++) {
        const pPrev = data.points[i - 1];
        const pCur = data.points[i];
        const x1 = xs[i - 1], y1 = mapY(pPrev.val);
        const x2 = xs[i], y2 = mapY(pCur.val);
        const isLastSeg = i === data.visibleCount - 1;
        html += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#1D3557" stroke-width="3.5"' + (isLastSeg ? ' class="svg-draw"' : "") + " />";
        if (isLastSeg) {
          html += '<circle class="svg-motion-orb" r="5.5" fill="#F6B352" stroke="#C85A32" stroke-width="2">' +
            '<animateMotion path="M ' + x1 + " " + y1 + " L " + x2 + " " + y2 + '" dur="1.15s" repeatCount="indefinite" />' +
            "</circle>";
        }
        html += '<g' + (isLastSeg ? ' class="svg-pop"' : "") + ">";
        html += '<rect x="' + ((x1 + x2) / 2 - 26) + '" y="' + ((y1 + y2) / 2 - 12) + '" width="52" height="20" rx="6" fill="#E9EFF7" />';
        html += '<text x="' + ((x1 + x2) / 2) + '" y="' + ((y1 + y2) / 2 + 3) + '" text-anchor="middle" fill="#1D3557" font-size="12" font-weight="800">' + pCur.jump + "</text>";
        html += "</g>";
      }
    }

    const activeCount = Math.max(1, data.visibleCount);
    for (let i = 0; i < activeCount; i++) {
      const p = data.points[i];
      const cx = xs[i];
      const cy = mapY(p.val);
      const isCur = (data.visibleCount === 0 && i === 0) || (i === data.visibleCount - 1);
      const fill = isCur ? "#C85A32" : "#1D3557";
      if (isCur) {
        html += '<circle cx="' + cx + '" cy="' + cy + '" r="16" fill="rgba(200,90,50,0.22)" class="svg-pulse" />';
        if (data.visibleCount > 0) {
          const hitX = 74 + p.deg * 74 + 33;
          html += '<path d="M ' + cx + " " + (cy + 10) + " L " + hitX + ' 162" stroke="#C85A32" stroke-width="1.8" stroke-dasharray="4 4" class="svg-dash-flow" />';
          html += '<circle class="svg-motion-orb" r="4.2" fill="#C85A32">' +
            '<animateMotion path="M ' + cx + " " + (cy + 10) + " L " + hitX + ' 162" dur="0.95s" repeatCount="indefinite" />' +
            "</circle>";
          html += '<rect x="' + ((cx + hitX) / 2 - 36) + '" y="141" width="72" height="17" rx="5" fill="#FCECE5" />';
          html += '<text x="' + ((cx + hitX) / 2) + '" y="153" text-anchor="middle" fill="#C85A32" font-size="11" font-weight="800">×100 → %6</text>';
        }
      }
      html += '<g' + (isCur ? ' class="svg-pop"' : "") + ">";
      html += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (isCur ? 9 : 7) + '" fill="' + fill + '" />';
      html += '<text x="' + cx + '" y="' + (cy - 17) + '" text-anchor="middle" fill="' + fill + '" font-size="13.5" font-weight="800">' + p.label + "=" + p.val.toFixed(2) + "</text>";
      html += "</g>";
    }

    html += '<text x="16" y="182" fill="#4A5366" font-size="12" font-weight="800">Escala:</text>';
    for (let d = 0; d < 7; d++) {
      const bx = 74 + d * 74;
      const isHit = d === data.activeDeg;
      const isUnused = d === 6;
      const bg = isHit ? "#C85A32" : (isUnused ? "#F1F5F9" : "#FFFFFF");
      const bd = isHit ? "#C85A32" : (isUnused ? "#CBD5E1" : "#1D3557");
      const tc = isHit ? "#FFFFFF" : (isUnused ? "#94A3B8" : "#1D3557");
      if (isHit) {
        html += '<rect x="' + (bx - 3) + '" y="161" width="72" height="48" rx="11" fill="none" stroke="rgba(200,90,50,0.42)" stroke-width="3" class="svg-pulse" />';
      }
      html += '<g' + (isHit ? ' class="svg-pop"' : "") + ">";
      html += '<rect x="' + bx + '" y="164" width="66" height="42" rx="9" fill="' + bg + '" stroke="' + bd + '" stroke-width="2" />';
      html += '<text x="' + (bx + 33) + '" y="180" text-anchor="middle" fill="' + tc + '" font-size="11.5" font-weight="700">[' + d + "]</text>";
      html += '<text x="' + (bx + 33) + '" y="198" text-anchor="middle" fill="' + tc + '" font-size="14" font-weight="800">' + SCALE_C[d] + "</text>";
      html += "</g>";
    }
    html += '<text x="551" y="221" text-anchor="middle" fill="#64748B" font-size="10.5" font-weight="700">(% 6 usa 0..5)</text>';
    svg.innerHTML = html;

    const outEl = document.getElementById("b-output");
    if (data.visibleCount === 0) {
      outEl.innerHTML = '<span class="state-empty">[] (esperando conversión)</span>';
    } else {
      outEl.innerHTML = data.points.slice(0, data.visibleCount).map(function (p, i) {
        const cls = i === data.visibleCount - 1 ? "state-chip is-new" : "state-chip";
        return '<span class="' + cls + '">(' + p.nota + ", 1.0)</span>";
      }).join("");
    }
  }

  // =========================================================
  // DIAPOSITIVA 13: TRAZA 2 — VORAZ + HEAPMAX (7 NODOS REALES)
  // =========================================================
  const GREEDY_STEPS = [
    {
      line: 1,
      formula: "grado_actual = 0 (C3) · Folía: [C3, G3, C3, B3]",
      note: "Partimos en C3 (grado 0). En cada paso metemos las 7 notas al HeapMax y sacamos la de mayor prioridad.",
      explain: "<strong>Regla de puntaje:</strong> <code>p = -(dist_obj + 0.5·dist_ant)</code>. Más cerca de 0 = mejor nota.",
      targetIdx: -1,
      heap: [
        { n: "—", p: "Vacío" }, { n: "—", p: "" }, { n: "—", p: "" },
        { n: "—", p: "" }, { n: "—", p: "" }, { n: "—", p: "" }, { n: "—", p: "" }
      ],
      guitar: [],
      bass: [],
      vars: [
        { k: "grado_obj", v: "—", changed: false },
        { k: "grado_actual", v: "0 (C3)", changed: true },
        { k: "dist_obj / ant", v: "—", changed: false },
        { k: "prioridad max", v: "—", changed: false }
      ]
    },
    {
      line: 6,
      formula: "paso 0 · obj=0 (C3) → raíz [0] = C3 (0.0)",
      note: "El objetivo es C3 y ya estamos en C3: ambas distancias valen 0, así que C3 gana con 0.0 y Bajo toca su 3ª (E3).",
      explain: "<strong>extraer_maximo():</strong> saca el índice <code>[0]</code> (<code>C3</code>, puntaje <code>0.0</code>). Bajo (índice par) toca su 3ª: <code>E3</code>.",
      targetIdx: 0,
      heap: [
        { n: "C3", p: "0.0" }, { n: "D3", p: "-1.5" }, { n: "B3", p: "-1.5" },
        { n: "E3", p: "-3.0" }, { n: "A3", p: "-3.0" }, { n: "F3", p: "-4.5" }, { n: "G3", p: "-4.5" }
      ],
      guitar: ["C3"],
      bass: ["E3"],
      vars: [
        { k: "grado_obj", v: "0 (C3)", changed: true },
        { k: "grado_actual", v: "0 (C3)", changed: false },
        { k: "dist_obj / ant", v: "0 / 0", changed: true },
        { k: "prioridad max", v: "0.0 (C3)", changed: true }
      ]
    },
    {
      line: 7,
      formula: "paso 1 · obj=4 (G3) → raíz [0] = G3 (-1.5)",
      note: "Ahora el objetivo es G3 desde C3: G3 (d_obj=0, d_ant=3 → -1.5) vence a A3 (-2.0). En paso impar el Bajo descansa.",
      explain: "<strong>¿Por qué -1.5?</strong> Para G3: <code>-(0 + 0.5×3) = -1.5</code>. Es mayor que <code>-2.0</code>, por eso sube al índice <code>[0]</code>.",
      targetIdx: 1,
      heap: [
        { n: "G3", p: "-1.5" }, { n: "F3", p: "-2.5" }, { n: "A3", p: "-2.0" },
        { n: "C3", p: "-3.0" }, { n: "D3", p: "-3.5" }, { n: "E3", p: "-3.0" }, { n: "B3", p: "-2.5" }
      ],
      guitar: ["C3", "G3"],
      bass: ["E3", "rest"],
      vars: [
        { k: "grado_obj", v: "4 (G3)", changed: true },
        { k: "grado_actual", v: "4 (G3)", changed: true },
        { k: "dist_obj / ant", v: "0 / 3", changed: true },
        { k: "prioridad max", v: "-1.5 (G3)", changed: true }
      ]
    },
    {
      line: 6,
      formula: "paso 2 · obj=0 (C3) → raíz [0] = C3 (-1.5)",
      note: "La Folía regresa al grado 0 (C3): C3 (-1.5) gana sobre B3 (-2.0). En índice par el Bajo vuelve a tocar E3.",
      explain: "<strong>Continuidad:</strong> ahora <code>ant</code> era 4 (G3); volver a C3 da <code>-(0 + 0.5×3) = -1.5</code> y gana en el heap.",
      targetIdx: 2,
      heap: [
        { n: "C3", p: "-1.5" }, { n: "D3", p: "-2.5" }, { n: "B3", p: "-2.0" },
        { n: "E3", p: "-3.0" }, { n: "F3", p: "-3.5" }, { n: "G3", p: "-3.0" }, { n: "A3", p: "-2.5" }
      ],
      guitar: ["C3", "G3", "C3"],
      bass: ["E3", "rest", "E3"],
      vars: [
        { k: "grado_obj", v: "0 (C3)", changed: true },
        { k: "grado_actual", v: "0 (C3)", changed: true },
        { k: "dist_obj / ant", v: "0 / 3", changed: false },
        { k: "prioridad max", v: "-1.5 (C3)", changed: true }
      ]
    },
    {
      line: 7,
      formula: "paso 3 · obj=6 (B3) → raíz [0] = B3 (-0.5)",
      note: "Objetivo B3 (grado 6) está a 1 paso circular de C3: B3 saca -0.5 y gana fácil. El Bajo cierra con silencio.",
      explain: "<strong>Distancia circular:</strong> de C3(0) a B3(6) hay solo 1 paso (<code>min(6, 7-6)=1</code>) → <code>p = -0.5</code>.",
      targetIdx: 3,
      heap: [
        { n: "B3", p: "-0.5" }, { n: "D3", p: "-2.5" }, { n: "C3", p: "-1.0" },
        { n: "E3", p: "-4.0" }, { n: "F3", p: "-4.5" }, { n: "G3", p: "-3.5" }, { n: "A3", p: "-2.0" }
      ],
      guitar: ["C3", "G3", "C3", "B3"],
      bass: ["E3", "rest", "E3", "rest"],
      vars: [
        { k: "grado_obj", v: "6 (B3)", changed: true },
        { k: "grado_actual", v: "6 (B3)", changed: true },
        { k: "dist_obj / ant", v: "0 / 1", changed: true },
        { k: "prioridad max", v: "-0.5 (B3)", changed: true }
      ]
    }
  ];

  function renderTraceGreedy(step) {
    const data = GREEDY_STEPS[step];
    document.getElementById("g-step-badge").textContent = "Paso " + step + " / 4";
    document.getElementById("g-formula").textContent = data.formula;
    document.getElementById("g-note").textContent = data.note;
    highlightCode("g-code", "g-line-badge", data.line, "g-ide-fill", step, 4);
    renderVars("g-vars", data.vars);
    renderExplain("g-explain", data.explain);

    const svg = document.getElementById("g-svg");
    const h = data.heap;
    const isInit = step === 0;

    const folia = ["0:C3", "4:G3", "0:C3", "6:B3"];
    let html = '<text x="16" y="25" fill="#4A5366" font-size="12.5" font-weight="800">Objetivo:</text>';
    for (let k = 0; k < 4; k++) {
      const fx = 86 + k * 90;
      const isCur = k === data.targetIdx;
      const isDone = k < data.targetIdx;
      const fBg = isCur ? "#C85A32" : (isDone ? "#E6F4F0" : "#FFFFFF");
      const fBd = isCur ? "#C85A32" : (isDone ? "#227A67" : "#CBD5E1");
      const fTc = isCur ? "#FFFFFF" : (isDone ? "#227A67" : "#4A5366");
      html += '<g' + (isCur ? ' class="svg-pop"' : "") + ">";
      html += '<rect x="' + fx + '" y="7" width="80" height="26" rx="8" fill="' + fBg + '" stroke="' + fBd + '" stroke-width="1.8" />';
      html += '<text x="' + (fx + 40) + '" y="24" text-anchor="middle" fill="' + fTc + '" font-size="12.5" font-weight="800">' + folia[k] + "</text>";
      html += "</g>";
    }
    html += '<rect x="448" y="7" width="160" height="26" rx="8" fill="#E9EFF7" />';
    html += '<text x="528" y="24" text-anchor="middle" fill="#1D3557" font-size="11.5" font-weight="800">p=-(d_obj+0.5·d_ant)</text>';

    const pos = [
      { x: 310, y: 74, w: 98, h: 38 },
      { x: 165, y: 136, w: 88, h: 34 },
      { x: 455, y: 136, w: 88, h: 34 },
      { x: 88, y: 194, w: 80, h: 32 },
      { x: 242, y: 194, w: 80, h: 32 },
      { x: 378, y: 194, w: 80, h: 32 },
      { x: 532, y: 194, w: 80, h: 32 }
    ];

    const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]];
    edges.forEach(function (e) {
      const a = pos[e[0]], b = pos[e[1]];
      html += '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" stroke="' + (isInit ? "#CBD5E1" : "#1D3557") + '" stroke-width="2.5"' + (!isInit ? ' class="svg-draw"' : "") + " />";
    });

    if (!isInit) {
      html += '<circle class="svg-motion-orb" r="4.5" fill="#F6B352">' +
        '<animateMotion path="M 165 136 L 310 74" dur="1.25s" repeatCount="indefinite" />' +
        "</circle>";
      html += '<circle class="svg-motion-orb" r="4.5" fill="#F6B352">' +
        '<animateMotion path="M 455 136 L 310 74" dur="1.25s" begin="0.45s" repeatCount="indefinite" />' +
        "</circle>";
    }

    pos.forEach(function (p, i) {
      const item = h[i];
      const isRoot = i === 0;
      const fill = isInit ? "#E2E8F0" : (isRoot ? "#C85A32" : (i <= 2 ? "#1D3557" : "#2A4A77"));
      const tc = isInit ? "#64748B" : "#FFFFFF";
      const subTc = isInit ? "#64748B" : (isRoot ? "#FFE6DC" : "#CBD5E1");
      if (isRoot && !isInit) {
        html += '<rect x="' + (p.x - p.w / 2 - 4) + '" y="' + (p.y - p.h / 2 - 4) + '" width="' + (p.w + 8) + '" height="' + (p.h + 8) + '" rx="14" fill="none" stroke="rgba(200,90,50,0.45)" stroke-width="3" class="svg-pulse" />';
        html += '<g class="svg-extract-float">';
        html += '<text x="' + (p.x + p.w / 2 + 12) + '" y="' + (p.y + 4) + '" fill="#C85A32" font-size="13" font-weight="800">↑ [0] MAX extraído</text>';
        html += "</g>";
      }
      html += '<g' + (!isInit ? ' class="svg-pop"' : "") + ">";
      html += '<rect x="' + (p.x - p.w / 2) + '" y="' + (p.y - p.h / 2) + '" width="' + p.w + '" height="' + p.h + '" rx="11" fill="' + fill + '" />';
      html += '<text x="' + p.x + '" y="' + (p.y - 1) + '" text-anchor="middle" fill="' + tc + '" font-size="13.5" font-weight="800">' + (i <= 2 && !isInit ? "[" + i + "] " : "") + item.n + "</text>";
      if (item.p) {
        html += '<text x="' + p.x + '" y="' + (p.y + 13) + '" text-anchor="middle" fill="' + subTc + '" font-size="11.5" font-family="Consolas, monospace">' + item.p + "</text>";
      }
      html += "</g>";
    });

    svg.innerHTML = html;

    const gEl = document.getElementById("g-out-guitar");
    const bEl = document.getElementById("g-out-bass");
    if (data.guitar.length === 0) {
      gEl.innerHTML = '<span class="state-empty">[]</span>';
      bEl.innerHTML = '<span class="state-empty">[]</span>';
    } else {
      gEl.innerHTML = data.guitar.map(function (n, i) {
        return '<span class="' + (i === data.guitar.length - 1 ? "state-chip is-new" : "state-chip") + '">' + n + "</span>";
      }).join("");
      bEl.innerHTML = data.bass.map(function (n) {
        return '<span class="state-chip is-sub">' + n + "</span>";
      }).join("");
    }
  }

  // =========================================================
  // DIAPOSITIVA 14: TRAZA 3 — BACKTRACKING CON PODA
  // =========================================================
  const BT_STEPS = [
    {
      line: 2,
      best: "mejor_costo = ∞ · mejor = []",
      stack: [],
      note: "En una escala circular de 7 notas, moverse una 7ª (+6) cuesta 1 paso, 3ª (+2) cuesta 2 y 5ª (+4) cuesta 3.",
      explain: "<strong>Orden heurístico:</strong> prueba primero la rama más barata (<code>7a</code>: +1, luego <code>3a</code>: +2, luego <code>5a</code>: +3).",
      state: "init",
      vars: [
        { k: "paso", v: "0 / 3", changed: true },
        { k: "r3 / r5 / r7", v: "0 / 0 / 0", changed: false },
        { k: "costo_acum", v: "0", changed: false },
        { k: "mejor_costo", v: "∞", changed: false }
      ]
    },
    {
      line: 8,
      best: "mejor_costo = ∞ · mejor = []",
      stack: ["D3 (7a)"],
      note: "Paso 0 (base E3=2): elige la 7ª más barata → (2+6)%7 = 1 ('D3'), costo = 1. r7 sube a 1 (límite alcanzado).",
      explain: "<strong>Baja por 7a:</strong> <code>(E3[2] + 6) % 7 = D3[1]</code>. Ahora <code>r7 = 1</code> bloquea usar otra 7ª seguida.",
      state: "n1",
      vars: [
        { k: "paso", v: "1 (en D3)", changed: true },
        { k: "r3 / r5 / r7", v: "0 / 0 / 1", changed: true },
        { k: "costo_acum", v: "1", changed: true },
        { k: "mejor_costo", v: "∞", changed: false }
      ]
    },
    {
      line: 4,
      best: "mejor_costo = ∞ · mejor = []",
      stack: ["D3 (7a)", "F3 (3a)"],
      note: "Paso 1 (base D3=1): como r7 == 1, restricciones() solo permite 3ª → (1+2)%7 = 3 ('F3'), costo = 3.",
      explain: "<strong>Regla activa:</strong> <code>r7 == 1</code> → <code>validos = ['3a']</code>. Se elige <code>F3</code> y se reinicia <code>r7 = 0</code>.",
      state: "n2",
      vars: [
        { k: "paso", v: "2 (en F3)", changed: true },
        { k: "r3 / r5 / r7", v: "1 / 0 / 0", changed: true },
        { k: "costo_acum", v: "3", changed: true },
        { k: "mejor_costo", v: "∞", changed: false }
      ]
    },
    {
      line: 3,
      best: "mejor_costo = 4 · [D3, F3, G3]",
      stack: ["D3 (7a)", "F3 (3a)", "G3 (7a)"],
      note: "Paso 2 (base A3=5): r7 ya es 0, elige 7ª → (5+6)%7 = 4 ('G3'), costo = 4. ¡Hoja alcanzada y récord guardado!",
      explain: "<strong>Solución encontrada:</strong> <code>paso == 3</code> → guarda <code>mejor_costo = 4</code> y <code>[D3, F3, G3]</code>.",
      state: "leaf",
      vars: [
        { k: "paso", v: "3 (hoja)", changed: true },
        { k: "r3 / r5 / r7", v: "0 / 0 / 1", changed: true },
        { k: "costo_acum", v: "4", changed: true },
        { k: "mejor_costo", v: "4 ★", changed: true }
      ]
    },
    {
      line: 7,
      best: "mejor_costo = 4 · [D3, F3, G3]",
      stack: ["D3 (7a)", "F3 (3a)"],
      note: "Retrocede (pop) al Paso 2 (costo 3): probar 3ª da 3+2=5 y 5ª da 3+3=6. Ambos son ≥ 4 y se podan.",
      explain: "<strong>Poda en Paso 2:</strong> <code>3 + 2 = 5 &gt;= 4</code> → <code>continue</code>. Se salta explorar ramas inútiles.",
      state: "prune2",
      vars: [
        { k: "paso", v: "2 (pop)", changed: true },
        { k: "r3 / r5 / r7", v: "1 / 0 / 0", changed: true },
        { k: "costo_acum", v: "3", changed: true },
        { k: "mejor_costo", v: "4 (poda ≥4)", changed: false }
      ]
    },
    {
      line: 1,
      best: "ÓPTIMO = [D3, F3, G3] (costo 4)",
      stack: [],
      note: "Vuelve a la raíz: las ramas 3ª y 5ª también alcanzan costo ≥ 4 y se podan. Resultado garantizado: [D3, F3, G3].",
      explain: "<strong>Fin del árbol:</strong> las ramas alternativas chocan contra la cota <code>4</code> y se cortan al instante.",
      state: "done",
      vars: [
        { k: "paso", v: "Fin DFS", changed: true },
        { k: "nodos", v: "Podados", changed: true },
        { k: "costo_acum", v: "0", changed: true },
        { k: "mejor_costo", v: "4 ★", changed: false }
      ]
    }
  ];

  function renderTraceBacktracking(step) {
    const data = BT_STEPS[step];
    document.getElementById("bt-step-badge").textContent = "Paso " + step + " / 5";
    document.getElementById("bt-best").textContent = data.best;
    document.getElementById("bt-note").textContent = data.note;
    highlightCode("bt-code", "bt-line-badge", data.line, "bt-ide-fill", step, 5);
    renderVars("bt-vars", data.vars);
    renderExplain("bt-explain", data.explain);

    const st = data.state;
    const svg = document.getElementById("bt-svg");

    const cN1 = (st === "n1") ? "#C85A32" : (st !== "init" ? "#227A67" : "#CBD5E1");
    const cN2 = (st === "n2") ? "#C85A32" : ((st === "leaf" || st === "prune2" || st === "done") ? "#227A67" : "#CBD5E1");
    const cLeaf = (st === "leaf") ? "#C85A32" : ((st === "prune2" || st === "done") ? "#227A67" : "#CBD5E1");
    const showPrune2 = (st === "prune2" || st === "done");
    const showPruneRoot = (st === "done");

    let html = "";
    html += '<rect x="424" y="8" width="184" height="24" rx="7" fill="#E9EFF7" />';
    html += '<text x="516" y="24" text-anchor="middle" fill="#1D3557" font-size="11.5" font-weight="800">Costos: 7a:+1 · 3a:+2 · 5a:+3</text>';
    html += '<text x="14" y="97" fill="#64748B" font-size="11" font-weight="800">P0 base E3</text>';
    html += '<text x="14" y="155" fill="#64748B" font-size="11" font-weight="800">P1 base D3</text>';
    html += '<text x="14" y="205" fill="#64748B" font-size="11" font-weight="800">P2 base A3</text>';

    html += '<line x1="275" y1="30" x2="165" y2="94" stroke="' + cN1 + '" stroke-width="3.5"' + (st === "n1" ? ' class="svg-draw"' : "") + " />";
    html += '<text x="204" y="55" fill="' + (st === "init" ? "#94A3B8" : "#1D3557") + '" font-size="12" font-weight="800">7a (+1)</text>';

    html += '<line x1="275" y1="30" x2="385" y2="94" stroke="' + (showPruneRoot ? "#B8372B" : "#CBD5E1") + '" stroke-width="2.5" stroke-dasharray="5 4"' + (showPruneRoot ? ' class="svg-draw"' : "") + " />";
    html += '<line x1="275" y1="30" x2="532" y2="94" stroke="' + (showPruneRoot ? "#B8372B" : "#CBD5E1") + '" stroke-width="2.5" stroke-dasharray="5 4"' + (showPruneRoot ? ' class="svg-draw"' : "") + " />";

    html += '<line x1="165" y1="94" x2="165" y2="152" stroke="' + cN2 + '" stroke-width="3.5"' + (st === "n2" ? ' class="svg-draw"' : "") + " />";
    html += '<text x="175" y="128" fill="' + (st === "n2" ? "#C85A32" : "#227A67") + '" font-size="11.5" font-weight="800">' + (st === "n2" ? "r7=1 → fuerza 3a" : "3a (+2)") + "</text>";

    html += '<line x1="165" y1="152" x2="138" y2="200" stroke="' + cLeaf + '" stroke-width="3.5"' + (st === "leaf" ? ' class="svg-draw"' : "") + " />";
    html += '<line x1="165" y1="152" x2="290" y2="200" stroke="' + (showPrune2 ? "#B8372B" : "#CBD5E1") + '" stroke-width="2.5" stroke-dasharray="5 4"' + (st === "prune2" ? ' class="svg-draw"' : "") + " />";

    if (st === "prune2" || st === "done") {
      html += '<path d="M 150 186 Q 178 172, 178 158" fill="none" stroke="#C85A32" stroke-width="2.5" stroke-dasharray="4 4" class="svg-dash-flow" />';
    }

    // Orbe explorador DFS en vivo según el paso actual
    let orbPath = "";
    if (st === "n1") orbPath = "M 275 30 L 165 94";
    else if (st === "n2") orbPath = "M 165 94 L 165 152";
    else if (st === "leaf") orbPath = "M 165 152 L 138 200";
    else if (st === "prune2") orbPath = "M 138 200 L 165 152 L 290 200";
    else if (st === "done") orbPath = "M 165 94 L 275 30 L 385 94";
    if (orbPath) {
      html += '<circle class="svg-motion-orb" r="5.5" fill="#F6B352" stroke="#1D3557" stroke-width="2">' +
        '<animateMotion path="' + orbPath + '" dur="1.3s" repeatCount="indefinite" />' +
        "</circle>";
    }

    html += '<rect x="235" y="12" width="80" height="32" rx="11" fill="#1D3557" />';
    html += '<text x="275" y="33" text-anchor="middle" fill="#FFFFFF" font-size="13.5" font-weight="800">dfs(0)</text>';

    if (st === "n1") {
      html += '<rect x="101" y="72" width="128" height="42" rx="13" fill="none" stroke="rgba(200,90,50,0.45)" stroke-width="3" class="svg-pulse" />';
    }
    html += '<g' + (st === "n1" ? ' class="svg-pop"' : "") + ">";
    html += '<rect x="105" y="76" width="120" height="34" rx="10" fill="' + cN1 + '" />';
    html += '<text x="165" y="98" text-anchor="middle" fill="#FFFFFF" font-size="13.5" font-weight="800">7a → D3 (1)</text>';
    html += "</g>";

    if (st === "n2") {
      html += '<rect x="101" y="130" width="128" height="42" rx="13" fill="none" stroke="rgba(200,90,50,0.45)" stroke-width="3" class="svg-pulse" />';
    }
    html += '<g' + (st === "n2" ? ' class="svg-pop"' : "") + ">";
    html += '<rect x="105" y="134" width="120" height="34" rx="10" fill="' + cN2 + '" />';
    html += '<text x="165" y="156" text-anchor="middle" fill="#FFFFFF" font-size="13.5" font-weight="800">3a → F3 (3)</text>';
    html += "</g>";

    if (st === "leaf") {
      html += '<rect x="74" y="180" width="128" height="40" rx="13" fill="none" stroke="rgba(34,122,103,0.45)" stroke-width="3" class="svg-pulse" />';
    }
    html += '<g' + (st === "leaf" ? ' class="svg-pop"' : "") + ">";
    html += '<rect x="78" y="184" width="120" height="32" rx="10" fill="' + cLeaf + '" />';
    html += '<text x="138" y="205" text-anchor="middle" fill="#FFFFFF" font-size="13.5" font-weight="800">7a → G3 ★4</text>';
    html += "</g>";

    if (showPrune2) {
      html += '<g' + (st === "prune2" ? ' class="svg-prune-shake"' : "") + ">";
      html += '<rect x="216" y="184" width="154" height="32" rx="10" fill="#FDECEB" stroke="#B8372B" stroke-width="2" />';
      html += '<text x="293" y="205" text-anchor="middle" fill="#B8372B" font-size="13" font-weight="800">3a/5a (≥5) ✕ PODADA</text>';
      html += "</g>";
    }
    if (showPruneRoot) {
      html += '<g class="svg-prune-shake">';
      html += '<rect x="320" y="76" width="130" height="34" rx="10" fill="#FDECEB" stroke="#B8372B" stroke-width="2" />';
      html += '<text x="385" y="98" text-anchor="middle" fill="#B8372B" font-size="13" font-weight="800">3a (≥4) ✕ PODA</text>';
      html += '<rect x="468" y="76" width="130" height="34" rx="10" fill="#FDECEB" stroke="#B8372B" stroke-width="2" />';
      html += '<text x="533" y="98" text-anchor="middle" fill="#B8372B" font-size="13" font-weight="800">5a (≥4) ✕ PODA</text>';
      html += "</g>";
    }

    svg.innerHTML = html;

    const stackEl = document.getElementById("bt-stack");
    if (data.stack.length === 0) {
      stackEl.innerHTML = '<span class="state-empty">[] (pila vacía)</span>';
    } else {
      stackEl.innerHTML = data.stack.map(function (item, idx) {
        const isTop = idx === data.stack.length - 1;
        return '<span class="' + (isTop ? "state-chip is-new" : "state-chip") + '">' + item + (isTop ? " ← tope" : "") + "</span>";
      }).join("");
    }
  }

  // =========================================================
  // DIAPOSITIVA 16: COMPLEJIDAD INTERACTIVA (5 PASOS)
  // =========================================================
  const COMP_CAPTIONS = [
    "Presiona avanzar para explicar cada tipo de complejidad paso a paso.",
    "1. Constante O(1): 24 escalas × 7 notas = 168 operaciones fijas, dure la canción 3 s o 60 s.",
    "2. Lineal O(N): el Browniano recorre N notas × 4 canales; el tiempo crece proporcionalmente a N.",
    "3. Lineal O(N) con HeapMax: aunque extraer cuesta O(log G), la escala siempre mide G = 7 (constante).",
    "4. Lineal-logarítmica O(N log N + S): ordena los instantes MIDI y genera S = 44 100 × seg muestras.",
    "5. Exponencial O(3^N) acotada: sin poda 3^23 ≈ 94 mil millones; con poda + max_nodos = 4 000 termina al instante."
  ];

  function renderComplexityStep(step) {
    const rows = document.querySelectorAll("[data-comp-step]");
    rows.forEach(function (row) {
      const s = Number(row.dataset.compStep);
      row.classList.toggle("is-revealed", s <= step);
      row.classList.toggle("is-current", s === step);
    });

    const curves = document.querySelectorAll("[data-curve-step]");
    curves.forEach(function (curve) {
      const steps = curve.dataset.curveStep.split(",").map(Number);
      const minS = Math.min.apply(null, steps);
      curve.classList.toggle("is-revealed", minS <= step);
      curve.classList.toggle("is-current", steps.indexOf(step) !== -1);
    });

    const cap = document.getElementById("comp-caption");
    if (cap) {
      cap.textContent = COMP_CAPTIONS[step] || COMP_CAPTIONS[0];
    }
  }

  // =========================================================
  // BIBLIOTECA HARDCORE: RENDERIZADO + BUSCADOR + SIMULADOR
  // =========================================================
  const NOTAS_TONALES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const INTERVALOS_SIM = {
    mayor: [0, 2, 4, 5, 7, 9, 11],
    menor: [0, 2, 3, 5, 7, 8, 10]
  };
  const FOLIA_IDX = [0, 4, 0, 6, 2, 6, 0, 4];
  const QUINTAS_IDX = [0, 3, 6, 2, 5, 1, 4];

  function formatPow3(n) {
    if (n <= 26) {
      return Math.pow(3, n).toLocaleString("es-MX");
    }
    const log10 = n * Math.log10(3);
    const exp = Math.floor(log10);
    const mant = Math.pow(10, log10 - exp);
    return mant.toFixed(2) + " × 10^" + exp;
  }

  function updateSimulator() {
    if (!simDur || !simResults) return;
    const dur = Number(simDur.value);
    const tonica = simNote.value;
    const modo = simMode.value;
    simDurVal.textContent = dur + " s";

    const baseIdx = NOTAS_TONALES.indexOf(tonica);
    const escalaNotas = [];
    const escalaMidis = [];
    INTERVALOS_SIM[modo].forEach(function (semi) {
      const pc = (baseIdx + semi) % 12;
      const midi = 48 + pc; // Réplica exacta de L44-51: base_midi = 48 + (p_nota.midi % 12)
      escalaNotas.push(NOTAS_TONALES[pc] + "3");
      escalaMidis.push(midi);
    });

    const progIdx = modo === "mayor" ? FOLIA_IDX : QUINTAS_IDX;
    const progNotas = progIdx.map(function (idx) { return escalaNotas[idx]; });

    const totalQl = dur * (140.0 / 60.0);
    const N = Math.max(1, Math.floor(totalQl / 1.0));
    const opsBrown = 40 * N - 3;
    const opsVoraz = 240 * N;
    const samplesS = 44100 * dur;
    const bytesWav = 44 + samplesS * 4;
    const mbWav = (bytesWav / (1024 * 1024)).toFixed(2);
    const mbTotal3 = ((bytesWav * 3) / (1024 * 1024)).toFixed(2);

    const pctDur = Math.min(100, Math.round((dur / 60) * 100));
    const pctClamp = Math.min(100, Math.round((Math.min(4000, Math.pow(3, Math.min(N, 8))) / 4000) * 100));

    simResults.innerHTML =
      '<div class="sim-kpi sim-kpi--ok">' +
        '<span class="sim-kpi__label">escala_actual (octava 3)</span>' +
        '<span class="sim-kpi__val">[' + escalaNotas.join(", ") + "]</span>" +
        '<span class="sim-kpi__sub">Claves MIDI: [' + escalaMidis.join(", ") + "]</span>" +
      "</div>" +
      '<div class="sim-kpi">' +
        '<span class="sim-kpi__label">Progresión (' + (modo === "mayor" ? "La Folía" : "Quintas") + ")</span>" +
        '<span class="sim-kpi__val">' + progNotas.join(" → ") + "</span>" +
        '<span class="sim-kpi__sub">Grados: [' + progIdx.join(", ") + "]</span>" +
      "</div>" +
      '<div class="sim-kpi">' +
        '<span class="sim-kpi__label">Pulsos N (140 BPM)</span>' +
        '<span class="sim-kpi__val">N = ' + N + " notas / canal</span>" +
        '<span class="sim-kpi__sub">Total en los 4 canales: ' + (4 * N) + " eventos base</span>" +
        '<div class="sim-meter"><div class="sim-meter__fill" style="width:' + pctDur + '%"></div></div>' +
      "</div>" +
      '<div class="sim-kpi sim-kpi--ok">' +
        '<span class="sim-kpi__label">Costo Lineal O(N)</span>' +
        '<span class="sim-kpi__val">Browniano: ' + opsBrown.toLocaleString("es-MX") + " ops</span>" +
        '<span class="sim-kpi__sub">Voraz + HeapMax (G=7): ~' + opsVoraz.toLocaleString("es-MX") + " ops</span>" +
        '<div class="sim-meter"><div class="sim-meter__fill" style="width:' + pctDur + '%"></div></div>' +
      "</div>" +
      '<div class="sim-kpi sim-kpi--accent">' +
        '<span class="sim-kpi__label">Backtracking: 3^N vs Tope</span>' +
        '<span class="sim-kpi__val">3^' + N + " = " + formatPow3(N) + "</span>" +
        '<span class="sim-kpi__sub">Con max_nodos = 4 000: ≤ 16 000 nodos (4 canales)</span>' +
        '<div class="sim-meter"><div class="sim-meter__fill" style="width:' + pctClamp + '%"></div></div>' +
      "</div>" +
      '<div class="sim-kpi">' +
        '<span class="sim-kpi__label">Síntesis WAV (44 100 Hz)</span>' +
        '<span class="sim-kpi__val">S = ' + samplesS.toLocaleString("es-MX") + " muestras</span>" +
        '<span class="sim-kpi__sub">' + mbWav + " MB por archivo (" + mbTotal3 + " MB los 3 WAV)</span>" +
        '<div class="sim-meter"><div class="sim-meter__fill" style="width:' + pctDur + '%"></div></div>' +
      "</div>";
  }

  function buildHardcoreLibrary() {
    if (!hcGrid) return;
    hcGrid.innerHTML = HARDCORE_ITEMS.map(function (item) {
      const snippetHtml = item.snippet
        ? '<pre class="hc-snippet">' + escapeHtml(item.snippet) + "</pre>"
        : "";
      const rowsHtml = item.rows.map(function (r) {
        return "<dt>" + escapeHtml(r[0]) + "</dt><dd>" + escapeHtml(r[1]) + "</dd>";
      }).join("");
      const searchBlob = (
        item.title + " " + item.tag + " " + item.pill + " " + item.ref + " " +
        (item.snippet || "") + " " + item.rows.map(function (r) { return r[0] + " " + r[1]; }).join(" ")
      ).toLowerCase();

      return (
        '<article class="hc-card" data-hc-cat="' + item.cat + '" data-hc-search="' + escapeHtml(searchBlob) + '">' +
          '<div class="hc-card__head">' +
            '<span class="hc-cat">' + escapeHtml(item.tag) + "</span>" +
            '<span class="comp-pill ' + item.pillCls + '">' + escapeHtml(item.pill) + "</span>" +
          "</div>" +
          "<h3>" + escapeHtml(item.title) + "</h3>" +
          '<p class="hc-code-ref"><code>' + escapeHtml(item.ref) + "</code></p>" +
          snippetHtml +
          '<dl class="hc-dl">' + rowsHtml + "</dl>" +
        "</article>"
      );
    }).join("");
  }

  function applyHardcoreFilters() {
    const q = currentHcQuery.trim().toLowerCase();
    const cards = Array.from(hcGrid.querySelectorAll(".hc-card"));
    let visibleCards = 0;

    cards.forEach(function (card) {
      const matchCat = currentHcTab === "all" || card.dataset.hcCat === currentHcTab;
      const matchQuery = !q || card.dataset.hcSearch.indexOf(q) !== -1;
      const show = matchCat && matchQuery && currentHcTab !== "simulador";
      card.hidden = !show;
      if (show) visibleCards += 1;
    });

    const showSimBlocks = (currentHcTab === "all" || currentHcTab === "simulador") && !q;
    if (hcSimPanel) hcSimPanel.hidden = !showSimBlocks;
    if (hcArchPanel) hcArchPanel.hidden = !showSimBlocks;

    const totalVisible = visibleCards + (showSimBlocks ? 2 : 0);
    if (hcCountBadge) {
      hcCountBadge.textContent = totalVisible + (totalVisible === 1 ? " bloque visible" : " bloques visibles");
    }
    if (hcEmpty) {
      hcEmpty.hidden = totalVisible > 0;
    }
  }

  function toggleHardcore(force) {
    const open = typeof force === "boolean" ? force : hardcoreModal.hidden;
    if (open) {
      stopAutoPlay();
      overviewModal.hidden = true;
      updateSimulator();
      applyHardcoreFilters();
    }
    hardcoreModal.hidden = !open;
  }

  hcTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      currentHcTab = tab.dataset.hcTab;
      hcTabs.forEach(function (t) {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", active ? "true" : "false");
      });
      applyHardcoreFilters();
    });
  });

  if (hcSearch) {
    hcSearch.addEventListener("input", function () {
      currentHcQuery = hcSearch.value;
      applyHardcoreFilters();
    });
  }

  if (simDur) simDur.addEventListener("input", updateSimulator);
  if (simNote) simNote.addEventListener("change", updateSimulator);
  if (simMode) simMode.addEventListener("change", updateSimulator);

  // =========================================================
  // RENDERIZADO GENERAL DE DIAPOSITIVAS Y NAVEGACIÓN
  // =========================================================
  function renderStepDots() {
    const max = maxStepsFor(currentSlide);
    if (max === 0) {
      stepDotsEl.innerHTML = "";
      if (stepLabelEl) stepLabelEl.textContent = "";
      return;
    }
    let html = "";
    for (let i = 1; i <= max; i++) {
      const doneCls = i <= currentStep ? " is-done" : "";
      const curCls = i === currentStep ? " is-current-dot" : "";
      html += '<span class="step-dot' + doneCls + curCls + '"></span>';
    }
    stepDotsEl.innerHTML = html;
    if (stepLabelEl) {
      stepLabelEl.textContent = "Paso " + currentStep + "/" + max;
    }
  }

  function renderCurrentState() {
    slides.forEach(function (slide, idx) {
      slide.classList.toggle("is-active", idx === currentSlide);
    });

    const activeSlide = slides[currentSlide];
    const num = currentSlide + 1;
    const total = slides.length;
    counterEl.textContent = String(num).padStart(2, "0") + " / " + String(total).padStart(2, "0");
    progressFill.style.width = ((num / total) * 100).toFixed(2) + "%";

    btnPrev.disabled = currentSlide === 0 && currentStep === 0;
    btnNext.disabled = currentSlide === total - 1 && currentStep === maxStepsFor(currentSlide);

    renderStepDots();

    const renderer = activeSlide.dataset.renderer;
    if (renderer === "reveal") renderRevealSlide(activeSlide, currentStep);
    if (renderer === "flow") renderFlowStep(currentStep);
    if (renderer === "brownian") renderTraceBrownian(currentStep);
    if (renderer === "greedy") renderTraceGreedy(currentStep);
    if (renderer === "backtracking") renderTraceBacktracking(currentStep);
    if (renderer === "complexity") renderComplexityStep(currentStep);

    notesText.textContent = SPEAKER_NOTES[currentSlide] || "";
    updateOverviewHighlight();
    updateAnimButtons();

    try {
      history.replaceState(null, "", "#slide-" + num);
    } catch (_) {
      // Ignorar si el navegador restringe replaceState bajo file://
    }
  }

  function goToSlide(index, step) {
    stopAutoPlay();
    stopWavAudio();
    const targetIdx = Math.max(0, Math.min(slides.length - 1, index));
    const dirCls = targetIdx > currentSlide ? "dir-next" : (targetIdx < currentSlide ? "dir-prev" : "");
    slides.forEach(function (s) {
      s.classList.remove("dir-next", "dir-prev");
    });
    if (dirCls && slides[targetIdx]) {
      slides[targetIdx].classList.add(dirCls);
    }
    currentSlide = targetIdx;
    const max = maxStepsFor(currentSlide);
    currentStep = Math.max(0, Math.min(max, step || 0));
    renderCurrentState();
  }

  function next() {
    stopAutoPlay();
    const max = maxStepsFor(currentSlide);
    if (currentStep < max) {
      currentStep += 1;
      renderCurrentState();
      return;
    }
    if (currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1, 0);
    }
  }

  function prev() {
    stopAutoPlay();
    if (currentStep > 0) {
      currentStep -= 1;
      renderCurrentState();
      return;
    }
    if (currentSlide > 0) {
      const prevIdx = currentSlide - 1;
      goToSlide(prevIdx, maxStepsFor(prevIdx));
    }
  }

  function buildOverview() {
    overviewGrid.innerHTML = slides.map(function (s, idx) {
      const title = s.dataset.title || ("Diapositiva " + (idx + 1));
      return (
        '<button type="button" class="overview-item" data-jump="' + idx + '">' +
        '<span class="overview-item__num">Diapositiva ' + String(idx + 1).padStart(2, "0") + "</span>" +
        '<span class="overview-item__title">' + title + "</span>" +
        "</button>"
      );
    }).join("");

    overviewGrid.addEventListener("click", function (ev) {
      const item = ev.target.closest("[data-jump]");
      if (!item) return;
      toggleOverview(false);
      goToSlide(Number(item.dataset.jump), 0);
    });
  }

  function updateOverviewHighlight() {
    const items = overviewGrid.querySelectorAll(".overview-item");
    items.forEach(function (item, idx) {
      item.classList.toggle("is-active", idx === currentSlide);
    });
  }

  function toggleOverview(force) {
    const open = typeof force === "boolean" ? force : overviewModal.hidden;
    if (open) {
      stopAutoPlay();
      hardcoreModal.hidden = true;
    }
    overviewModal.hidden = !open;
  }

  function toggleNotes(force) {
    const open = typeof force === "boolean" ? force : notesPanel.hidden;
    notesPanel.hidden = !open;
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(function () {});
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(function () {});
    }
  }

  // Botones internos de mini-animación (▶ Animar / ↺)
  document.querySelectorAll("[data-anim-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleAutoPlay();
    });
  });

  document.querySelectorAll("[data-anim-reset]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      stopAutoPlay();
      currentStep = 0;
      renderCurrentState();
    });
  });

  // Eventos de UI y teclado
  btnPrev.addEventListener("click", function (e) { e.stopPropagation(); prev(); });
  btnNext.addEventListener("click", function (e) { e.stopPropagation(); next(); });
  btnOverview.addEventListener("click", function (e) { e.stopPropagation(); toggleOverview(); });
  btnOverviewClose.addEventListener("click", function () { toggleOverview(false); });
  btnNotes.addEventListener("click", function (e) { e.stopPropagation(); toggleNotes(); });
  btnNotesClose.addEventListener("click", function () { toggleNotes(false); });
  btnFullscreen.addEventListener("click", function (e) { e.stopPropagation(); toggleFullscreen(); });
  btnHardcore.addEventListener("click", function (e) { e.stopPropagation(); toggleHardcore(); });
  btnHardcoreFinal.addEventListener("click", function (e) { e.stopPropagation(); toggleHardcore(true); });
  btnHardcoreClose.addEventListener("click", function () { toggleHardcore(false); });

  stage.addEventListener("click", function (ev) {
    if (ev.target.closest("button, a, input, select")) return;
    if (!overviewModal.hidden || !hardcoreModal.hidden) return;
    next();
  });

  document.addEventListener("keydown", function (ev) {
    const inFormField = Boolean(ev.target && ev.target.closest("input, select, textarea"));

    if (ev.key === "Escape") {
      if (inFormField) { ev.target.blur(); return; }
      if (!hardcoreModal.hidden) { toggleHardcore(false); return; }
      if (autoTimer !== null) { stopAutoPlay(); return; }
      if (!overviewModal.hidden) toggleOverview(false);
      else if (!notesPanel.hidden) toggleNotes(false);
      return;
    }

    // No interceptar teclas mientras el usuario escribe en el buscador o usa el simulador
    if (inFormField) return;

    if (ev.key === "b" || ev.key === "B") {
      ev.preventDefault();
      toggleHardcore();
      return;
    }

    if (ev.key === "o" || ev.key === "O") {
      ev.preventDefault();
      toggleOverview();
      return;
    }

    if (ev.key === "n" || ev.key === "N") {
      ev.preventDefault();
      toggleNotes();
      return;
    }

    if (ev.key === "f" || ev.key === "F") {
      ev.preventDefault();
      toggleFullscreen();
      return;
    }

    if (!overviewModal.hidden || !hardcoreModal.hidden) return;

    if (ev.key === "p" || ev.key === "P") {
      ev.preventDefault();
      toggleAutoPlay();
      return;
    }

    if (ev.key === "ArrowRight" || ev.key === "ArrowDown" || ev.key === " " || ev.key === "PageDown") {
      ev.preventDefault();
      next();
    } else if (ev.key === "ArrowLeft" || ev.key === "ArrowUp" || ev.key === "PageUp") {
      ev.preventDefault();
      prev();
    } else if (ev.key === "Home") {
      ev.preventDefault();
      goToSlide(0, 0);
    } else if (ev.key === "End") {
      ev.preventDefault();
      goToSlide(slides.length - 1, maxStepsFor(slides.length - 1));
    }
  });

  window.addEventListener("resize", fitStage);
  document.addEventListener("fullscreenchange", fitStage);

  // Arranque inicial
  buildOverview();
  buildHardcoreLibrary();
  updateSimulator();
  applyHardcoreFilters();
  fitStage();
  const hashMatch = /^#slide-(\d+)$/.exec(window.location.hash);
  if (hashMatch) {
    goToSlide(Number(hashMatch[1]) - 1, 0);
  } else {
    goToSlide(0, 0);
  }
})();
