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
  const hcQuizPanel = document.getElementById("hc-quiz-panel");
  const hcQuickChips = document.getElementById("hc-quick-chips");
  const btnHcClear = document.getElementById("btn-hc-clear");
  const btnQuizRandom = document.getElementById("btn-quiz-random");
  const btnQuizNext = document.getElementById("btn-quiz-next");
  const btnQuizReveal = document.getElementById("btn-quiz-reveal");
  const quizCounterEl = document.getElementById("quiz-counter");
  const quizTagEl = document.getElementById("quiz-tag");
  const quizQuestionEl = document.getElementById("quiz-question");
  const quizRefEl = document.getElementById("quiz-ref");
  const quizAnswerEl = document.getElementById("quiz-answer");
  const simDur = document.getElementById("sim-dur");
  const simDurVal = document.getElementById("sim-dur-val");
  const simNote = document.getElementById("sim-note");
  const simMode = document.getElementById("sim-mode");
  const simResults = document.getElementById("sim-results");
  const audioStatusEl = document.getElementById("audio-status");

  // Notas del orador (1-2 frases por diapositiva, ocultas por defecto con tecla N)
  const SPEAKER_NOTES = [
    "Presentar el proyecto de Amelia Enora Marceline Chavez B. y Fernando Hernandez: convertir azar en música comparando dos optimizaciones.",
    "Contexto histórico: Iannis Xenakis creó la música estocástica en los años 50 inspirándose en gases y movimiento browniano, respondiendo con Metastaseis al serialismo rígido.",
    "Repasar los 5 términos musicales del proyecto: escala, modo (mayor alegre / menor triste), los 7 grados, intervalos (a 2 notas = 3ª) y progresiones.",
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
  // CATÁLOGO ENCICLOPÉDICO MODO PARANOIA (95 FICHAS QUIRÚRGICAS)
  // Extraído 100% del código real (679 L), meltysynth (3917 L), TXT, README y Propuesta
  // =========================================================
  const HARDCORE_ITEMS = [
    // =====================================================
    // 1. ALGORITMOS (10 FICHAS)
    // =====================================================
    {
      cat: "algoritmos",
      tag: "Algoritmo · L35–64",
      pill: "Constante · Θ(1)",
      pillCls: "comp-pill--const",
      title: "1. Construcción de escalas cromáticas por semitonos",
      ref: "escala_por_intervalos(tonica, modo, octava=3) · construir_repositorio_escalas()",
      snippet: "base_midi = 12 * (octava + 1)  # 48 (C3)\nmidi_fijado = base_midi + (p_nota.midi % 12)",
      rows: [
        ["De dónde sale", "Sistema temperado occidental de 12 semitonos: patrón mayor [0,2,4,5,7,9,11] (T-T-S-T-T-T-S) y menor natural [0,2,3,5,7,8,10] (T-S-T-T-S-T-T)."],
        ["Para qué sirve", "Precalcula las 24 escalas posibles (12 tónicas × 2 modos) plegadas dentro de la octava 3 cerrada (MIDI 48..59)."],
        ["Cómo se conecta", "Lee nota_para_la_escala y modo_de_la_escala; entrega escala_actual (lista de 7 strings) a Browniano, Voraz y Backtracking."],
        ["Complejidad", "Tiempo Θ(1) y Espacio Θ(1): ejecuta exactamente 12 × 2 × 7 = 168 iteraciones fijas sin importar duracion."]
      ]
    },
    {
      cat: "algoritmos",
      tag: "Algoritmo · L68–138",
      pill: "Lineal · Θ(N)",
      pillCls: "comp-pill--linear",
      title: "2. Movimiento Browniano 1D (Proceso de Wiener discretizado)",
      ref: "movimiento_browniano_bajo / guitarra_jazz / campana_tubular / steel_drums",
      snippet: "valores = [inicio]; actual = inicio\nfor _ in range(n - 1): actual += random.gauss(0.0, paso)",
      rows: [
        ["De dónde sale", "Modelo físico de partículas suspendidas en un fluido (Einstein/Wiener): caminata aleatoria continua X_k = X_{k-1} + Z_k con Z_k ~ N(0, 1)."],
        ["Por qué este y no randint", "random.randint genera ruido blanco sin memoria (saltos inconexos); el browniano preserva autocorrelación temporal entre notas vecinas."],
        ["Cómo se conecta", "Alimenta directo canales_config (aleatorio_bruto.wav) y genera valors_aislados_* para Voraz y Backtracking."],
        ["Complejidad", "Tiempo Θ(N) estricto (40N - 3 operaciones elementales sumando los 4 canales) y Espacio Θ(N)."]
      ]
    },
    {
      cat: "algoritmos",
      tag: "Algoritmo · L88, 104, 120, 136",
      pill: "Lineal · Θ(N)",
      pillCls: "comp-pill--linear",
      title: "3. Cuantización escalar y plegado modular a grados (×100 % 6)",
      ref: "canal_bajo = [(escala_actual[int(x * 100) % 6], dedtln) for x in resultado]",
      snippet: "idx = int(x * 100) % 6  # amplifica decimales pequeños y proyecta a 0..5",
      rows: [
        ["De dónde sale", "Discretización uniforme + aritmética modular para mapear números reales continuos (-∞, +∞) a índices finitos de una lista."],
        ["Por qué × 100", "Como random.gauss(0, 1) produce variaciones del orden de centésimas/décimas (ej. 0.14 → 0.29), sin multiplicar por 100 int(x) daría 0 repetidamente."],
        ["Seguridad con negativos", "En Python el operador % siempre devuelve el signo del divisor (6 > 0): por ejemplo int(-0.85 * 100) % 6 = -85 % 6 = 5, nunca un índice negativo inválido."]
      ]
    },
    {
      cat: "algoritmos",
      tag: "Algoritmo · L248–285",
      pill: "Lineal · O(N) (G=7)",
      pillCls: "comp-pill--linear",
      title: "4. Algoritmo Voraz de conducción armónica de voces",
      ref: "algoritmo_voraz_para_aproximar(secuencia_base, escala, progresion, factor_paso=0.5)",
      snippet: "grado_objetivo = progresion[paso_idx % len(progresion)] % num_grados\nprioridad = -(dist_objetivo + factor_paso * dist_anterior)",
      rows: [
        ["De dónde sale", "Paradigma Greedy (elección localmente óptima paso a paso sin reconsiderar decisiones pasadas) guiado por La Folía o Quintas."],
        ["Para qué sirve", "Minimiza simultáneamente la distancia al acorde ideal del pulso (peso 1.0) y el salto melódico desde la nota previa (peso 0.5)."],
        ["Cómo se conecta", "Construye un HeapMax(candidatos) de G=7 nodos en cada pulso para guitarra (canal 1) y campana tubular (canal 2)."],
        ["Complejidad", "O(N · (G + log G)) con G = 7 constante → Tiempo lineal Θ(N) (~240N) y Espacio Θ(N)."]
      ]
    },
    {
      cat: "algoritmos",
      tag: "Algoritmo · L300–330",
      pill: "Lineal · Θ(N)",
      pillCls: "comp-pill--linear",
      title: "5. Generador de contrapunto complementario (3ª diatónica + silencio)",
      ref: "las_notas_de_bajo_y_percusion_que_son_complementarias_a_las_otras()",
      snippet: "if i % 2 == 0: idx_tercera = (idx_ref + 2) % cantidad_de_notas\nelse: resultado.append(('rest', dur))",
      rows: [
        ["De dónde sale", "Armonización paralela por terceras diatónicas (+2 grados en la escala) combinada con articulación rítmica binaria."],
        ["Para qué sirve", "Evita la saturación tímbrica en voraz.wav: en pulsos pares acompaña a una tercera de distancia y en impares inserta silencio ('rest')."],
        ["Cómo se conecta", "Bajo acompaña a sequence_guitarra_voraz; Steel drums acompaña a sequence_campana_voraz → arma canales_config_voraz."],
        ["Complejidad", "Tiempo Θ(N) y Espacio Θ(N): 1 recorrido lineal con búsqueda O(1) en diccionario."]
      ]
    },
    {
      cat: "algoritmos",
      tag: "Algoritmo · L345–493",
      pill: "O(N)..O(3^N) ≤4000",
      pillCls: "comp-pill--exp",
      title: "6. Backtracking con Poda (DFS + Branch & Bound)",
      ref: "poda_de_backtracking() · dfs(paso, siguiente_nota3, siguiente_nota5, siguiente_nota7, costo_acum)",
      snippet: "if costo_acum >= mejor_costo: return\nif nodos_visitados > max_nodos: limite_alcanzado = True; return",
      rows: [
        ["De dónde sale", "Búsqueda primero en profundidad (DFS) sobre árbol de decisiones con retroceso explícito (pop) y acotamiento por costo (Branch & Bound)."],
        ["Por qué hace falta", "Las reglas de racha máxima dependen del camino previo; cuando una combinación futura encarece o bloquea, el algoritmo retrocede y prueba otra rama."],
        ["Triple aceleración", "1) Heurística voraz local (.sort() prueba 7a de costo 1 primero); 2) Poda por cota superior mejor_costo; 3) Tope anytime max_nodos = 4000."],
        ["Complejidad", "Mejor caso Ω(N); Peor teórico O(3^N); Ejecución real acotada a ≤ 4 000 nodos por instrumento. Espacio O(N)."]
      ]
    },
    {
      cat: "algoritmos",
      tag: "Algoritmo · L391–401",
      pill: "Constante · O(1)/paso",
      pillCls: "comp-pill--const",
      title: "7. Planificador polifónico por aritmética modular (mod 1..4)",
      ref: "en_que_orden_tocaran_para_que_no_se_sature(paso)",
      snippet: "bajo: paso%1==0 | guitarra: paso%2==0 | campana: paso%3==0 | steel drums: paso%4==0",
      rows: [
        ["De dónde sale", "Polirritmia modular con períodos 1, 2, 3 y 4, cuyo mínimo común múltiplo es MCM(1,2,3,4) = 12 pulsos."],
        ["Efecto musical", "Bajo lleva el pulso continuo (100%), guitarra entra al 50%, campana al 33.3% y steel drums al 25%; solo cada 12 notas coinciden los 4."],
        ["Efecto algorítmico brutal", "Cuando devuelve False, dfs NO ramifica en 3 hijos (solo inserta 'rest' con costo +0 y baja 1 nivel), reduciendo el exponente de 3^N a 3^(N/2), 3^(N/3) y 3^(N/4)."]
      ]
    },
    {
      cat: "algoritmos",
      tag: "Algoritmo · L403–417",
      pill: "Constante · O(1)/paso",
      pillCls: "comp-pill--const",
      title: "8. Autómata finito de restricciones de racha melódica",
      ref: "reestricciones_de_la_siguiente_nota(r3, r5, r7, max_terceras=2, max_quintas=2, max_septimas=1)",
      snippet: "if r3 >= 2: return ['5a']\nif r5 >= 2: return ['7a']\nif r7 >= 1: return ['3a']\nreturn ['3a', '5a', '7a']",
      rows: [
        ["De dónde sale", "Máquina de estados determinista que prohíbe intervalos repetitivos monótonos y fuerza rotación armónica."],
        ["Ciclo de escape", "Al saturar terceras fuerza quinta; al saturar quintas fuerza séptima; al usar una séptima fuerza tercera (ciclo dirigido 3a → 5a → 7a → 3a)."],
        ["Impacto en el árbol", "Cada vez que un contador alcanza su tope, el factor de ramificación de ese nivel cae de 3 hijos a exactamente 1 hijo."]
      ]
    },
    {
      cat: "algoritmos",
      tag: "Algoritmo · L484–492",
      pill: "Lineal · O(N)",
      pillCls: "comp-pill--linear",
      title: "9. Red de seguridad determinista (Fallback post-DFS)",
      ref: "if not mejor_secuencia: ... grado_3a = (grado_base + desplazamientos['3a']) % num_grados",
      snippet: "if not mejor_secuencia:\n    # rellena respetando turnos mod 1..4 y transponiendo a 3a (+2)",
      rows: [
        ["Cuándo se activaría", "Solo si max_nodos fuera menor que n_pasos (ej. si alguien pidiera N > 4000 pasos y el DFS se detuviera antes de tocar la primera hoja)."],
        ["Por qué es buena ingeniería", "Garantiza por contrato que poda_de_backtracking jamás devuelva una lista vacía cuando n_pasos > 0, asegurando que backtracking.wav siempre dure duracion_s."]
      ]
    },
    {
      cat: "algoritmos",
      tag: "Algoritmo · L533–640",
      pill: "O(N log N + S)",
      pillCls: "comp-pill--nlogn",
      title: "10. Motor de eventos discretos (Timsort doble) y síntesis por tramos",
      ref: "envoltorio_para_los_varios_wav() · sorted() · synth.render()",
      snippet: "instantes = sorted(set(acciones_por_muestra.keys()) | {num_muestras})\nacciones_ordenadas = sorted(acciones, key=lambda x: 0 if x[0]=='off' else 1)",
      rows: [
        ["Dos ordenamientos distintos", "1) Ordena globalmente los instantes de muestra únicos t_0 < t_1 < ... < t_k; 2) En cada instante ordena localmente los eventos poniendo 'off' (0) antes que 'on' (1)."],
        ["Síntesis exacta entre eventos", "Entre t_actual y t_siguiente el estado MIDI no cambia, por lo que synth.render sintetiza de golpe tramo = t_siguiente - t_actual muestras estéreo."],
        ["Complejidad", "O(N log N) para ordenar eventos + O(S) para sintetizar y cuantizar las muestras PCM."]
      ]
    },

    // =====================================================
    // 2. ESTRUCTURAS DE DATOS (10 FICHAS)
    // =====================================================
    {
      cat: "estructuras",
      tag: "Estructura · L171–175",
      pill: "Objeto · O(1)",
      pillCls: "comp-pill--const",
      title: "11. Clase NodoHeap: encapsulación de clave, carga útil e índice",
      ref: "class NodoHeap(dato, prioridad: float)",
      snippet: "self.dato = (nota_candidata, dur_ql, idx_nota)\nself.prioridad = prioridad\nself.indice = None",
      rows: [
        ["Qué desacopla", "Separa limpiamente la clave de comparación (self.prioridad: float) del dato musical compuesto (self.dato: tuple), evitando que Python intente comparar strings o Nones en caso de empate."],
        ["Por qué guarda self.indice", "Permite conocer en O(1) en qué celda del arreglo vive cada nodo en todo momento (patrón clásico de colas de prioridad indexadas para Dijkstra/Prim)."]
      ]
    },
    {
      cat: "estructuras",
      tag: "Estructura · L161–238",
      pill: "Árbol en arreglo · O(G)",
      pillCls: "comp-pill--linear",
      title: "12. Clase HeapMax: árbol binario casi completo sobre list contigua",
      ref: "padre(i)=(i-1)//2 · izquierdo(i)=2*i+1 · derecho(i)=2*i+2",
      snippet: "Índice: [  0,    1,    2,    3,    4,    5,    6 ]\nNivel:  [Raíz, H_izq, H_der, Nieto0..Nieto3]",
      rows: [
        ["Por qué arreglo y no punteros", "Un árbol binario completo en arreglo 0-based no gasta memoria en punteros izq/der/padre, tiene localidad de caché perfecta y calcula parientes con aritmética entera O(1)."],
        ["Invariante estructural y de orden", "Todas las hojas están en los últimos niveles compactadas a la izquierda, y todo padre tiene prioridad >= que sus dos hijos."]
      ]
    },
    {
      cat: "estructuras",
      tag: "Estructura · L186–215",
      pill: "O(log G)",
      pillCls: "comp-pill--const",
      title: "13. Mecánica interna de intercambiar(), flotar() y hundir()",
      ref: "HeapMax.intercambiar · HeapMax.flotar · HeapMax.hundir",
      snippet: "if izq < self.tamano and self.heap[izq].prioridad > self.heap[mayor].prioridad: mayor = izq",
      rows: [
        ["intercambiar(i, j)", "Hace swap en tupla O(1) y actualiza inmediatamente self.heap[i].indice = i y self.heap[j].indice = j para no romper el invariante de índices."],
        ["flotar(i) (sift-up)", "Sube un nodo recién insertado comparando contra padre(i) hasta que prioridad <= padre o llega a la raíz i = 0."],
        ["hundir(i) (sift-down)", "Compara el nodo i contra sus dos hijos (izq y der), elige el mayor de los tres y baja hasta restaurar la propiedad Max-Heap."]
      ]
    },
    {
      cat: "estructuras",
      tag: "Estructura · L227–238",
      pill: "O(log G)",
      pillCls: "comp-pill--const",
      title: "14. Seguridad de bordes en extraer_maximo() (cola vacía o de 1 nodo)",
      ref: "HeapMax.extraer_maximo() -> NodoHeap | None",
      snippet: "if self.tamano == 0: return None\nmaximo = self.heap[0]; ultimo = self.heap.pop(); self.tamano -= 1\nif self.tamano > 0: self.heap[0] = ultimo; ...; self.hundir(0)",
      rows: [
        ["Caso tamano == 0", "Devuelve None sin lanzar IndexError (manejado además en L278 con if mejor is not None)."],
        ["Caso crítico tamano == 1", "self.heap.pop() deja la lista vacía y tamano pasa a 0; el guardián if self.tamano > 0 evita escribir self.heap[0] = ultimo sobre una lista vacía."],
        ["Limpieza de estado", "Antes de retornar asigna maximo.indice = None porque ese nodo ya no pertenece al montículo."]
      ]
    },
    {
      cat: "estructuras",
      tag: "Estructura · L37–582",
      pill: "7 Tablas Hash · O(1)",
      pillCls: "comp-pill--const",
      title: "15. Inventario completo de los 7 diccionarios del sistema",
      ref: "dict (6) + collections.defaultdict (1)",
      snippet: "1) INTERVALOS (2) | 2) repositorio_escalas (24) | 3) indice_para_la_nota... (7)\n4) desplazamientos (3) | 5) orden_de_elegir... (3) | 6) mapa_midi (12) | 7) acciones_por_muestra",
      rows: [
        ["Claves compuestas inmutables", "repositorio_escalas usa tuplas (nota, modo) como clave porque list no es hasheable en Python pero tuple sí."],
        ["Índice inverso O(1)", "indice_para_la_nota_dentro_de_la_escala invierte escala_actual (nota → 0..6) para no pagar escala.index(nota) lineal en cada pulso."],
        ["Caché global MIDI", "mapa_midi contiene las 12 notas cromáticas de la octava 3 (MIDI 48..59), evitando instanciar objetos pesados music21.pitch.Pitch miles de veces."]
      ]
    },
    {
      cat: "estructuras",
      tag: "Estructura · L150, 334, 515",
      pill: "Contrato de datos",
      pillCls: "comp-pill--const",
      title: "16. Esquema uniforme de pistas: canales_config (x3 variantes)",
      ref: "canales_config · canales_config_voraz · canales_config_backtracking",
      snippet: "{\"channel\": 0..3, \"program\": 35|26|14|114, \"velocity\": 70, \"sequence\": [(simbolo, dur_ql), ...]}",
      rows: [
        ["Diseño desacoplado", "Los tres algoritmos producen exactamente la misma interfaz list[dict], lo que permite que envoltorio_para_los_varios_wav sea 100% agnóstico del algoritmo generador."],
        ["Representación de notas y silencios", "Cada elemento de sequence es una tupla (str | None, float), p. ej. ('E3', 1.0) para nota activa o ('rest', 1.0) para silencio."]
      ]
    },
    {
      cat: "estructuras",
      tag: "Estructura · L609",
      pill: "Conjunto Hash · O(E)",
      pillCls: "comp-pill--linear",
      title: "17. Conjunto matemático (set) con centinela de fin de archivo",
      ref: "instantes = sorted(set(acciones_por_muestra.keys()) | {num_muestras})",
      snippet: "set(acciones_por_muestra.keys()) | {num_muestras}",
      rows: [
        ["Por qué hace falta {num_muestras}", "Si los últimos pulsos de los 4 canales son 'rest', no existe ningún evento note_off en el final del archivo; inyectar {num_muestras} obliga a renderizar la cola de silencio/reverberación hasta completar duracion_s exacta."],
        ["Deduplicación O(1)", "Si num_muestras ya existía como clave de algún note_off, el operador unión | evita duplicarlo para no crear un tramo vacío tramo = 0."]
      ]
    },
    {
      cat: "estructuras",
      tag: "Estructura · L424–480",
      pill: "Pila LIFO · O(N)",
      pillCls: "comp-pill--linear",
      title: "18. Pila explícita in-place (secuencia_actual) + Call Stack de Python",
      ref: "secuencia_actual.append(...) · dfs(...) · secuencia_actual.pop()",
      snippet: "secuencia_actual.append((nota_elegida, dur_ql))\ndfs(paso + 1, sig_r3, sig_r5, sig_r7, nuevo_costo)\nsecuencia_actual.pop()  # O(1) amortizado",
      rows: [
        ["Por qué mutar y deshacer", "Si pasáramos secuencia_actual + [(nota, dur)] por valor en 4 000 nodos con N = 140, clonaríamos hasta 560 000 tuplas; con append/pop existe 1 sola lista viva en RAM."],
        ["Cuándo se clona (.copy())", "Únicamente en L444 (mejor_secuencia = secuencia_actual.copy()) cuando llegamos a una hoja completa que mejora estrictamente mejor_costo."]
      ]
    },
    {
      cat: "estructuras",
      tag: "Estructura · L575–639",
      pill: "Buffers C · O(S)",
      pillCls: "comp-pill--linear",
      title: "19. Buffers vectoriales NumPy: float32 planar → int16 entrelazado",
      ref: "left, right (float32) → stereo (S, 2) → stereo_pcm16 (int16)",
      snippet: "left = np.zeros(num_muestras, dtype=np.float32)\nstereo = np.column_stack((left, right))  # entrelazado LRLRLR...",
      rows: [
        ["Planar vs Interleaved", "MeltySynth escribe por separado el canal izquierdo (left) y derecho (right) (formato planar); el estándar WAV exige muestras alternadas [L₀, R₀, L₁, R₁...] que column_stack arma en C."],
        ["Huella exacta por muestra", "float32 usa 4 bytes/canal; int16 estéreo final usa exactamente 4 bytes por frame estéreo (2 bytes L + 2 bytes R)."]
      ]
    },
    {
      cat: "estructuras",
      tag: "Estructura interna · meltysynth.py",
      pill: "Pool fijo · O(64)",
      pillCls: "comp-pill--const",
      title: "20. Pool preasignado de voces (_VoiceCollection) y array('f') en MeltySynth",
      ref: "meltysynth.py: create_buffer (array 'd') · read_int16_array_as_float_array (array 'f') · _VoiceCollection",
      snippet: "self._voices = _VoiceCollection(self, self._maximum_polyphony)  # 64 voces precreadas",
      rows: [
        ["Object Pool Pattern", "MeltySynth preasigna 64 objetos _Voice al iniciar para no crear ni destruir instancias durante la síntesis de audio (evita pausas del Garbage Collector)."],
        ["array.array de stdlib", "Las ondas PCM del SoundFont se guardan en array('f') compacto (4 bytes por float en vez de 28 bytes por float de Python)."]
      ]
    },

    // =====================================================
    // 3. MATEMÁTICAS, TEORÍA MUSICAL Y DSP (10 FICHAS)
    // =====================================================
    {
      cat: "matematicas",
      tag: "Fórmula · L68–72",
      pill: "Discretización",
      pillCls: "comp-pill--const",
      title: "21. Tabla exacta de conversión Tempo (140 BPM) → Pulsos N",
      ref: "seg_por_ql = 60/140 ≈ 0.428571 s · N = int((duracion * 140 / 60) // 1.0)",
      snippet: "3 s → N=7 | 10 s → N=23 | 15 s → N=35 | 30 s → N=70 | 60 s → N=140",
      rows: [
        ["Por qué división entera // 1.0", "Trunca la última fracción de negra que no cabe completa en duracion (ej. en 10 s caben 23.33 negras → genera 23 notas = 9.857 s de notas + 0.143 s de cola final)."],
        ["Duraciones exactas sin residuo", "Cuando duracion es múltiplo de 3 s (3, 6, 9, 12, ..., 60 s), duracion × 140 / 60 es un entero exacto (7, 14, 21, ..., 140 negras)."]
      ]
    },
    {
      cat: "matematicas",
      tag: "Geometría modular · L266, L373",
      pill: "Métrica en Z_7",
      pillCls: "comp-pill--const",
      title: "22. Distancia geodésica en el grupo cíclico Z_7",
      ref: "diff = abs(a - b) % 7 · dist = min(diff, 7 - diff)",
      snippet: "Salto 3a (+2): min(2, 5) = 2\nSalto 5a (+4): min(4, 3) = 3\nSalto 7a (+6): min(6, 1) = 1  ← ¡el más cercano!",
      rows: [
        ["Propiedades métricas", "Cumple no-negatividad, identidad d(a,a)=0, simetría d(a,b)=d(b,a) y desigualdad triangular sobre el ciclo de 7 grados."],
        ["Intuición musical clave", "Subir 6 grados en una escala de 7 notas equivale a bajar apenas 1 grado hacia atrás (ej. de C a B hay 1 paso diatónico en el ciclo). Por eso 7a tiene costo 1."]
      ]
    },
    {
      cat: "matematicas",
      tag: "Optimización · L272",
      pill: "Suma ponderada",
      pillCls: "comp-pill--linear",
      title: "23. Función multiobjetivo del Voraz y sensibilidad de factor_paso = 0.5",
      ref: "prioridad = -(dist_objetivo + factor_paso * dist_anterior)",
      snippet: "J(g) = 1.0 · d(g, g_obj) + 0.5 · d(g, g_ant)   →   max -J(g)",
      rows: [
        ["Por qué d_obj gana siempre en el Voraz puro", "Si elegimos g = g_obj, d_obj = 0 y el costo es 0.5 · d(g_obj, g_ant). Por desigualdad triangular, para cualquier otro grado g se cumple d(g, g_obj) + 0.5·d(g, g_ant) >= 0.5·d(g_obj, g_ant): ¡con factor_paso <= 1.0 el óptimo local siempre incluye a g_obj!"],
        ["Cuándo cambiaría de nota", "Si factor_paso fuera > 1.0 (ej. 2.0), la inercia melódica pesaría más que el acorde y elegiría grados intermedios de paso."]
      ]
    },
    {
      cat: "matematicas",
      tag: "Orden total · L461–463",
      pill: "Tupla lexicográfica",
      pillCls: "comp-pill--const",
      title: "24. Ordenamiento lexicográfico de ramas en Backtracking",
      ref: "candidatos_ordenados.append((dist, -orden_de_elegir_el_grado[etiqueta], etiqueta, grado_cand))",
      snippet: "7a: (1, -3, '7a', g)  <  3a: (2, -1, '3a', g)  <  5a: (3, -2, '5a', g)",
      rows: [
        ["Cómo compara .sort() en Python", "Compara componente a componente: primero menor dist; si hubiera empate en dist, menor -orden (es decir, mayor preferencia '7a':3 > '5a':2 > '3a':1)."],
        ["Por qué acelera la poda", "Explorar primero las ramas de costo +1 encuentra rápidamente una primera hoja de costo muy bajo (~4/3 · R), activando la poda en casi todo el resto del árbol."]
      ]
    },
    {
      cat: "matematicas",
      tag: "Armonía · L240–243",
      pill: "Teoría tonal",
      pillCls: "comp-pill--const",
      title: "25. Estructura armónica de La Folía y el Ciclo de Quintas",
      ref: "progresion_folia = [0,4,0,6,2,6,0,4] · progresion_quintas = [0,3,6,2,5,1,4]",
      snippet: "En Do mayor: C - G - C - B - E - B - C - G  (8 pulsos)\nEn La menor: A - D - G - C - F - B - E      (7 pulsos, saltos de +3 mod 7 = cuarta asc / quinta desc)",
      rows: [
        ["Simetría matemática de Quintas", "En Z_7, sumar +3 módulo 7 genera todos los residuos porque mcd(3, 7) = 1: recorre los 7 grados de la escala sin repetir ninguno antes de cerrar el ciclo."],
        ["Carácter de La Folía", "Uno de los ostinatos europeos más antiguos (s. XV–Barroco): alterna tónica (0) y tensión dominante/sensible (4 y 6) pasando por mediante (2)."]
      ]
    },
    {
      cat: "matematicas",
      tag: "Acústica / MIDI · L44, 150, 545",
      pill: "Estándar MIDI 1.0",
      pillCls: "comp-pill--const",
      title: "26. Acústica MIDI: Temperamento igual, 0xC0 y los 4 programas GM",
      ref: "f(m) = 440 · 2^((m - 69) / 12) Hz · base_midi = 48 (C3 ≈ 130.81 Hz)",
      snippet: "ch0: Fretless Bass (35) | ch1: Electric Guitar Jazz (26)\nch2: Tubular Bells (14) | ch3: Steel Drums (114) | vel = 70/127",
      rows: [
        ["Rango de frecuencias de octava 3", "Desde C3 (MIDI 48 → 130.81 Hz) hasta B3 (MIDI 59 → 246.94 Hz)."],
        ["Byte de estado 0xC0", "En binario 1100_0000: el nibble alto 0xC indica Program Change; MeltySynth recibe el canal por separado y asigna patch_number = program."]
      ]
    },
    {
      cat: "matematicas",
      tag: "Probabilidad · L76–133",
      pill: "Varianza σ² = k",
      pillCls: "comp-pill--linear",
      title: "27. Propiedades estadísticas de la caminata gaussiana",
      ref: "X_0 ~ U(-1, 1) · X_k = X_0 + ∑_{j=1}^k Z_j con Z_j ~ N(0, 1)",
      snippet: "E[X_k | X_0] = X_0   |   Var(X_k | X_0) = k · paso² = k",
      rows: [
        ["Difusión proporcional a √k", "La desviación estándar crece como √k (a los 100 pasos es ±10.0), pero el módulo % 6 envuelve ese espacio infinito sobre un cilindro finito de 6 notas."],
        ["Independencia entre canales", "Las 4 llamadas a movimiento_browniano_* consumen muestras frescas e independientes del generador Mersenne Twister."]
      ]
    },
    {
      cat: "matematicas",
      tag: "DSP · L539, L637",
      pill: "Nyquist + PCM16",
      pillCls: "comp-pill--linear",
      title: "28. Muestreo a 44.1 kHz, rango dinámico de 96 dB y saturación (clip)",
      ref: "stereo_pcm16 = np.clip(stereo * 32767.0, -32768, 32767).astype(np.int16)",
      snippet: "SNR_16bit ≈ 6.02 × 16 + 1.76 = 98.08 dB  |  f_max = 22 050 Hz",
      rows: [
        ["Por qué × 32767.0 y clip en -32768", "En complemento a dos de 16 bits el rango representable es [-2^15, 2^15 - 1] = [-32768, 32767]; multiplicar por 32767 mantiene simetría entre semiciclos positivos y negativos."],
        ["Qué evita np.clip", "En C/NumPy, int16(33000) desborda por wrap-around a -32536 (inversión instantánea de fase = estallido audible); np.clip lo limita limpiamente al techo."]
      ]
    },
    {
      cat: "matematicas",
      tag: "Formato binario · L639",
      pill: "44 + 4·S bytes",
      pillCls: "comp-pill--linear",
      title: "29. Ecuación exacta del peso en disco del archivo RIFF/WAVE",
      ref: "Bytes = 44 (cabecera RIFF/fmt/data) + S × 2 canales × 2 bytes",
      snippet: "Tasa de bits = 44 100 × 2 × 16 = 1 411 200 bits/s = 176 400 bytes/s\nPara 10 s: 44 + 1 764 000 = 1 764 044 bytes (1.68 MB)",
      rows: [
        ["Cabecera estándar de 44 bytes", "Contiene 'RIFF', tamaño total - 8, 'WAVE', subchunk 'fmt ' (PCM=1, AudioFormat=1, NumChannels=2, SampleRate=44100, ByteRate=176400, BlockAlign=4, BitsPerSample=16) y 'data'."],
        ["Crecimiento lineal exacto", "Cada segundo adicional añade exactamente 176.4 KB por archivo (529.2 KB sumando los 3 archivos .wav)."]
      ]
    },
    {
      cat: "matematicas",
      tag: "Rítmica · L391–401",
      pill: "Densidad 25/12",
      pillCls: "comp-pill--const",
      title: "30. Densidad polifónica media de los turnos modulares",
      ref: "Suma armónica parcial: 1/1 + 1/2 + 1/3 + 1/4 = 25/12 ≈ 2.083 voces/pulso",
      snippet: "Bruto: 4.00 voces/pulso | Voraz: 3.00 voces/pulso | Backtracking: 2.08 voces/pulso",
      rows: [
        ["Comparación cuantitativa de las 3 mezclas", "En aleatorio_bruto suenan siempre los 4 canales (4.0 voces); en voraz suenan 4 en pares y 2 en impares (promedio 3.0); en backtracking el promedio cae a 2.083 voces por pulso, dando máxima claridad."]
      ]
    },

    // =====================================================
    // 4. COMPLEJIDAD EXACTA Y DEMOSTRACIONES (10 FICHAS)
    // =====================================================
    {
      cat: "complejidad",
      tag: "Demostración · TXT L12–14",
      pill: "T(N) = 40N - 3",
      pillCls: "comp-pill--linear",
      title: "31. Derivación término a término de 40N - 3 (Movimiento Browniano)",
      ref: "ANALISIS_DE_COMPLEJIDAD.txt: 5 + 4(3N - 2) + 4(4N) + 4(3N) / conteo elemental",
      snippet: "5 ops previas (L68-72) + 4 canales × [bucle gauss (3N-2) + listas canal y aislados] → Θ(N)",
      rows: [
        ["De dónde sale el -3", "Cada función browniana inicializa valores=[inicio] y actual=inicio (1 paso base) y ejecuta el bucle exactamente (N - 1) veces: 5 + 4(... - 2) produce la constante -3."],
        ["Cota estrecha Θ(N)", "No tiene ramas condicionales dependientes de los valores aleatorios: mejor caso = peor caso = caso promedio = Θ(N)."]
      ]
    },
    {
      cat: "complejidad",
      tag: "Demostración · TXT L21–24",
      pill: "T(N) ≈ 240N",
      pillCls: "comp-pill--linear",
      title: "32. Derivación término a término de 240N (Algoritmo Voraz + HeapMax)",
      ref: "ANALISIS_DE_COMPLEJIDAD.txt: con G = 7 constante → O(N)",
      snippet: "Por pulso: evaluar 7 grados + construir_heap(7) + extraer_maximo() ≈ 104 ops\n2 canales voraces (~208N) + 2 canales complementarios (~32N) ≈ 240N",
      rows: [
        ["Por qué NO es O(N log N)", "log₂(G) = log₂(7) ≈ 2.807 es una constante fija del dominio musical, NO crece cuando el usuario aumenta duracion de 3 s a 60 s."],
        ["Cuándo sería O(N log G)", "Solo si el tamaño de la escala G fuera un parámetro variable de entrada que tendiera a infinito."]
      ]
    },
    {
      cat: "complejidad",
      tag: "Teorema clásico · L217–219",
      pill: "Floyd · O(G)",
      pillCls: "comp-pill--const",
      title: "33. Demostración formal de que construir_heap() es O(G) y no O(G log G)",
      ref: "for i in range((self.tamano // 2) - 1, -1, -1): self.hundir(i)",
      snippet: "Con G = 7: índices 3, 4, 5, 6 son hojas (0 swaps).\nSolo ejecuta hundir(2) [alt 1], hundir(1) [alt 1] y hundir(0) [alt 2] → ¡máx 4 intercambios!",
      rows: [
        ["Serie convergente", "En cualquier heap de tamaño G, a altura h hay a lo sumo ⌈G / 2^(h+1)⌉ nodos, y ∑_{h=0}^∞ h / 2^(h+1) = 1, por lo que el trabajo total está acotado por O(G)."],
        ["Comparación contra insertar G veces", "Insertar 7 veces con flotar recorrería desde las hojas hacia arriba; construir_heap de abajo hacia arriba ahorra trabajo porque la mayoría de nodos están abajo."]
      ]
    },
    {
      cat: "complejidad",
      tag: "Cotas DFS · L428–482",
      pill: "Ω(N) .. O(3^N)",
      pillCls: "comp-pill--exp",
      title: "34. Mejor caso, peor caso teórico y cota práctica del Backtracking",
      ref: "R_bajo=N | R_guit=⌈N/2⌉ | R_camp=⌈N/3⌉ | R_drums=⌈N/4⌉",
      snippet: "Mejor caso: Ω(N) (si la 1ª rama da costo 0 o podas inmediatas)\nPeor sin poda: O(3^R_inst) ≤ O(3^N) | Peor real en código: O(N + max_nodos) con max_nodos=4000",
      rows: [
        ["Efecto real de los turnos en 10 s (N=23)", "Steel drums solo decide en pasos 0,4,8,12,16,20 (6 pasos activos → máx 3^6 = 729 hojas incluso SIN poda: ¡explora el árbol entero exacto sin tocar el tope 4000!)."],
        ["Campana en 10 s (N=23)", "Solo decide en 8 pasos activos (3^8 = 6 561 hojas sin poda; con restricciones y poda visita apenas unas decenas de nodos y halla el óptimo exacto)."]
      ]
    },
    {
      cat: "complejidad",
      tag: "Síntesis · L533–640",
      pill: "Θ(N log N + S)",
      pillCls: "comp-pill--nlogn",
      title: "35. Desglose completo de complejidad del motor de audio WAV",
      ref: "E ≤ 8N eventos MIDI · K ≤ N + 2 instantes únicos · S = 44100 · duracion_s",
      snippet: "1) Armar eventos: O(N) | 2) Encolar muestras: O(N) | 3) sorted(instantes): O(K log K) = O(N log N)\n4) synth.render acumulado: ∑ tramo = S → O(S) | 5) column_stack + clip + write: O(S)",
      rows: [
        ["Por qué ∑ tramo = S exactamente", "Los intervalos [instantes[idx], instantes[idx+1]) forman una partición telescópica exacta de [0, num_muestras]: la suma de todos los count enviados a render() es exactamente S."],
        ["Ordenamiento interno por muestra", "En cada instante hay a lo sumo 8 eventos (4 'off' + 4 'on' de los 4 canales), así que sorted(acciones_por_muestra[t]) cuesta O(1) por instante."]
      ]
    },
    {
      cat: "complejidad",
      tag: "Memoria · L1–679",
      pill: "Espacio Θ(N + S)",
      pillCls: "comp-pill--nlogn",
      title: "36. Presupuesto exacto de memoria RAM en cada fase",
      ref: "Escalas O(1) + Listas O(N) + Pila DFS O(N) + SoundFont O(SF2) + Buffers O(S)",
      snippet: "SoundFont sf2 (1 vez): ~141 MB | Buffers por llamada WAV (60 s): ~53 MB pico (liberados al salir)",
      rows: [
        ["Por qué NO se triplica la RAM de los 3 WAV", "left, right, stereo y stereo_pcm16 son variables locales de envoltorio_para_los_varios_wav: al retornar cada llamada su conteo de referencias cae a 0 y CPython reutiliza esa RAM."],
        ["Complejidad espacial auxiliar de algoritmos", "HeapMax usa O(G) = O(1) espacio auxiliar; poda_de_backtracking usa O(N) para secuencia_actual, mejor_secuencia y la pila de llamadas."]
      ]
    },
    {
      cat: "complejidad",
      tag: "Reconciliación · ANALISIS_DE_COMPLEJIDAD.txt",
      pill: "Guía del .TXT",
      pillCls: "comp-pill--exp",
      title: "37. Cómo explicar cada línea de ANALISIS_DE_COMPLEJIDAD.txt si el jurado pregunta",
      ref: "ANALISIS_DE_COMPLEJIDAD.txt L1–52 vs análisis formal estricto",
      snippet: "TXT L32 'Activación de buffers: Constante' → 3 líneas fijas de código Python, que reservan O(S) muestras en C.\nTXT L38 '2 log_2' y L44-50 'Costo lineal' → lineal respecto al tamaño del audio S + ordenamiento log-lineal.",
      rows: [
        ["Cómo responder con elegancia", "En el .txt inicial resumimos por bloque sintáctico (por ejemplo llamar a np.zeros es 1 instrucción de alto nivel y exportar recorre linealmente el audio S), y en la ecuación final L52 consolidamos todo rigurosamente como Θ(3^N + N log N + S)."],
        ["Por qué L52 iguala a Θ(3^N)", "Matemáticamente, cuando N → ∞ sin tope de nodos, la exponencial 3^N domina asintóticamente a cualquier polinomio o N log N; en la práctica, con max_nodos = 4000, domina O(S)."]
      ]
    },
    {
      cat: "complejidad",
      tag: "Tiempo real (Wall-clock)",
      pill: "Cuello de botella",
      pillCls: "comp-pill--nlogn",
      title: "38. ¿Dónde se va realmente el 98% del tiempo al ejecutar el programa?",
      ref: "Python puro en meltysynth._render_block() vs algoritmos simbólicos",
      snippet: "Browniano + Voraz + Backtracking (4 canales, 10 s): < 0.05 segundos\n3 × synth.render() en Python puro (3 × 441 000 muestras): varios segundos de CPU",
      rows: [
        ["Explicación de sistemas", "Aunque O(S) es lineal, S = 441 000 por archivo (1.32 millones de muestras en los 3 WAV) y meltysynth interpola osciladores, envolventes y filtros biquad en bucles de Python interpretado."],
        ["Conclusión clave", "Los algoritmos de estructuras de datos terminan casi instantáneamente; la espera percibida en consola corresponde a la síntesis DSP en Python puro."]
      ]
    },
    {
      cat: "complejidad",
      tag: "Tabla maestra · 16 funciones",
      pill: "O / Ω / Θ",
      pillCls: "comp-pill--const",
      title: "39. Resumen formal O, Ω y Θ de todas las operaciones del código",
      ref: "Referencia rápida para preguntas relámpago de pizarrón",
      snippet: "padre/izq/der/intercambiar: Θ(1) | flotar/hundir/insertar/extraer: O(log G), Ω(1) | construir_heap: Θ(G)\nescala_por_intervalos / repositorio: Θ(1) | browniano: Θ(N) | voraz: Θ(N) | dfs: Ω(N), O(3^N) | wav: Θ(N log N + S)",
      rows: [
        ["Por qué flotar y hundir tienen Ω(1)", "En el mejor caso el elemento insertado ya es menor que su padre (0 intercambios → Ω(1)), y al extraer puede detenerse en la primera comparación si ya supera a sus hijos."],
        ["Por qué construir_heap es Θ(G)", "Recorre obligatoriamente los G//2 nodos internos haciendo al menos 1 comparación por nodo interno (Ω(G)) y a lo sumo 2G comparaciones (O(G))."]
      ]
    },
    {
      cat: "complejidad",
      tag: "Experimento mental · Escalabilidad",
      pill: "N → ∞",
      pillCls: "comp-pill--exp",
      title: "40. ¿Cómo escala el sistema si variamos cada parámetro independientemente?",
      ref: "Duración D · Tempo BPM · Tamaño de escala G · Frecuencia de muestreo Fs",
      snippet: "N = ⌊D · BPM / 60⌋   |   S = D · Fs   |   T_total_práctico = O(N·G + min(3^N, M) + N log N + S)",
      rows: [
        ["Si sube BPM al doble (280 BPM) con misma duración D", "N se duplica (doble de notas y eventos MIDI), pero S (muestras de audio) permanece exactamente igual."],
        ["Si sube Fs a 96 000 Hz con misma duración D", "N no cambia en absoluto (mismas decisiones de Voraz y Backtracking), pero S y el tamaño del .wav crecen 2.18×."]
      ]
    },

    // =====================================================
    // 5. RADIOGRAFÍA QUIRÚRGICA L1–L679 + MELTYSYNTH (12 FICHAS)
    // =====================================================
    {
      cat: "radiografia",
      tag: "Mapa general · L1–679",
      pill: "11 Secciones",
      pillCls: "comp-pill--const",
      title: "41. Mapa arquitectónico exacto línea por línea del archivo principal",
      ref: "PROYECTO_FINAL_MUSICA_ESTOCASTICA.py (679 líneas)",
      snippet: "L1-6 Imports | L8-31 Inputs | L33-64 Escalas | L66-138 Browniano x4 | L140-155 Config Bruto\nL157-238 HeapMax | L240-339 Voraz + 3as | L343-520 Backtracking | L524-640 Motor WAV | L643-679 3 Renders",
      rows: [
        ["Flujo de ejecución", "Es un script secuencial de arriba hacia abajo: pide 3 inputs en consola, precalcula estructuras globales, ejecuta los 3 modelos generativos en memoria y finalmente sintetiza los 3 archivos .wav en serie."]
      ]
    },
    {
      cat: "radiografia",
      tag: "Radiografía · L8–31",
      pill: "Validación E/S",
      pillCls: "comp-pill--const",
      title: "42. Bloque de entradas y guardianes ValueError",
      ref: "duracion (L10–14) · nota_para_la_escala (L18–23) · modo_de_la_escala (L26–29)",
      snippet: "if duracion > 60: raise ValueError('El límite es de un minuto')\nif duracion < 3: raise ValueError('El timepo debe de ser al menos mayor a 3 segundo')",
      rows: [
        ["Por qué tuplas en notas_validas y modos_validos", "Usar tuplas inmutables ('C', ..., 'B') y ('mayor', 'menor') protege las constantes de configuración contra mutaciones accidentales."],
        ["Fallo rápido (Fail-Fast)", "Valida cada entrada apenas se ingresa, antes de cargar el SoundFont de 141 MB o construir diccionarios."]
      ]
    },
    {
      cat: "radiografia",
      tag: "Radiografía · L33–64",
      pill: " Construcción tonal",
      pillCls: "comp-pill--const",
      title: "43. Cómo funciona exactamente el plegado de octava en L44–51",
      ref: "base_midi = 12 * (octava + 1) · midi_fijado = base_midi + (p_nota.midi % 12)",
      snippet: "Ej. G mayor (octava 3): G3(55), A3(57), B3(59), C4(60)→48(C3), D4(62)→50(D3), E4(64)→52(E3), F#4(66)→54(F#3)",
      rows: [
        ["Qué logra midi_fijado", "Cuando la transposición cruza de B3 (59) a C4 (60), p_nota.midi % 12 vuelve a 0 y lo pliega a 48 (C3): mantiene las 7 notas confinadas en una única octava cerrada."],
        ["Detalle de music21", "pitch.Pitch(midi=51).nameWithOctave devuelve 'E-3' (Mi bemol 3 en notación music21); como todo el programa usa las cadenas devueltas por escala_actual, todas las llaves coinciden siempre."]
      ]
    },
    {
      cat: "radiografia",
      tag: "Radiografía · L66–155",
      pill: "4 Generadores",
      pillCls: "comp-pill--linear",
      title: "44. Las 4 funciones brownianas y las listas paralelas canal_* / valors_aislados_*",
      ref: "canal_bajo (tuplas nota, dur) vs valors_aislados_bajo (enteros 0..5)",
      snippet: "canal_bajo = [(escala_actual[int(x * 100) % 6], dedtln) for x in resultado]\nvalors_aislados_bajo = [int(x * 100) % 6 for x in resultado]",
      rows: [
        ["Por qué guarda dos formatos", "canal_* ya tiene formato listo ('E3', 1.0) para renderizar aleatorio_bruto.wav directo; valors_aislados_* guarda los índices enteros crudos 0..5 para alimentar los algoritmos posteriores."],
        ["Reasignación de variable resultado", "La variable global resultado se reutiliza limpiamente 4 veces seguidas (L87, L103, L119, L135), quedándose al final con la caminata de steel drums."]
      ]
    },
    {
      cat: "radiografia",
      tag: "Radiografía · L289–296",
      pill: "Pipeline Voraz",
      pillCls: "comp-pill--linear",
      title: "45. Preparación y normalización de secuencias en el bloque Voraz",
      ref: "secuencia_guitarra_antes_del_voraz → secuencia_guitarra_algoritmo_voraz → sequence_guitarra_voraz",
      snippet: "secuencia_guitarra_antes_del_voraz = [(escala_actual[idx % len(escala_actual)], dedtln) for idx in valors_aislados_guitarra]\nsequence_guitarra_voraz = [(simbolo, dedtln) for simbolo, _ in secuencia_guitarra_algoritmo_voraz]",
      rows: [
        ["Qué hacen L295–296", "Fuerzan explícitamente que todas las tuplas salientes tengan duración uniforme dedtln = 1.0 antes de generar las voces complementarias de bajo y percusión."]
      ]
    },
    {
      cat: "radiografia",
      tag: "Radiografía · L377–389",
      pill: "Polimorfismo",
      pillCls: "comp-pill--const",
      title: "46. Polimorfismo defensivo en obtener_grado_y_duracion(idx)",
      ref: "Acepta int, (int, float), (str, float), (str, None) o cualquier valor inesperado",
      snippet: "if isinstance(elem, int): return elem % num_grados, dur_defecto\nif isinstance(elem, tuple) and len(elem) == 2: ...",
      rows: [
        ["Por qué está escrita así", "Permite pasarle a poda_de_backtracking tanto listas de enteros puros (valors_aislados_bajo) como listas de tuplas estilo canal_bajo sin cambiar una sola línea."],
        ["Fallback seguro a grado 0", "Si recibe una tupla con un símbolo desconocido o 'rest', retorna (0, dur_limpia) (tónica) en lugar de lanzar KeyError."]
      ]
    },
    {
      cat: "radiografia",
      tag: "Radiografía · L422–483",
      pill: "Clausura + nonlocal",
      pillCls: "comp-pill--exp",
      title: "47. Clausura léxica, nonlocal y doble barrera de poda en dfs()",
      ref: "nonlocal mejor_costo, mejor_secuencia, nodos_visitados, limite_alcanzado",
      snippet: "# Barrera 1 (al entrar, L434): if costo_acum >= mejor_costo: return\n# Barrera 2 (antes de bajar, L467): if nuevo_costo >= mejor_costo: continue",
      rows: [
        ["Por qué hay DOS podas de costo", "L467 (lookahead pruning) evita gastar append(), llamada recursiva e incremento de nodos_visitados si ya sabemos que el hijo empata o supera mejor_costo; L434 protege además las llamadas de pasos 'rest' o cambios de mejor_costo en ramas hermanas."],
        ["Por qué >= y no >", "Si nuevo_costo == mejor_costo tampoco vale la pena explorarlo: ya tenemos guardada una secuencia válida con ese mismo costo mínimo."]
      ]
    },
    {
      cat: "radiografia",
      tag: "Radiografía · L526–572",
      pill: "Traducción a segundos",
      pillCls: "comp-pill--linear",
      title: "48. Cursor en negras (cursor_ql) a ventanas de tiempo en segundos",
      ref: "onset_ql = cursor_ql · offset_ql = cursor_ql + dur_ql · onset_s = onset_ql * seg_por_ql_local",
      snippet: "if simbolo != 'rest' and simbolo is not None:\n    midi_key = mapa_midi.get(simbolo) or int(pitch.Pitch(simbolo).midi)",
      rows: [
        ["Cómo maneja los silencios ('rest')", "Cuando simbolo == 'rest', NO agrega ningún evento MIDI a la lista eventos, pero SÍ avanza cursor_ql = offset_ql para que la siguiente nota entre en el tiempo exacto."],
        ["Doble seguro en mapa_midi.get()", "Busca primero en O(1) en mapa_midi; si algún día entrara una nota de otra octava no precalculada, cae suavemente a pitch.Pitch(simbolo).midi."]
      ]
    },
    {
      cat: "radiografia",
      tag: "Radiografía · L581–606",
      pill: "Clamping de muestras",
      pillCls: "comp-pill--linear",
      title: "49. Conversión de segundos a muestras enteras y recorte de seguridad",
      ref: "m_on = max(0, min(num_muestras, int(onset_s * sample_rate)))",
      snippet: "if m_on < num_muestras: acciones_por_muestra[m_on].append(('on', ...))\nif m_off <= num_muestras and m_off > m_on: acciones_por_muestra[m_off].append(('off', ...))",
      rows: [
        ["Por qué m_on < num_muestras estricto", "Encender una nota exactamente en la última muestra num_muestras no tendría ninguna muestra restante para sonar."],
        ["Por qué m_off <= num_muestras y m_off > m_on", "Permite apagar notas justo al borde final num_muestras y garantiza que toda nota encendida tenga duración positiva de al menos 1 muestra."]
      ]
    },
    {
      cat: "radiografia",
      tag: "Motor interno · meltysynth.py",
      pill: "3 917 líneas DSP",
      pillCls: "comp-pill--nlogn",
      title: "50. Cadena de síntesis interna de MeltySynth al ejecutar render()",
      ref: "Synthesizer.render → _render_block (64 muestras) → _Voice.process → _write_block",
      snippet: "Oscillator (interpolación wavetable SF2) → VolumeEnvelope (ADSR) → LFO (vibrato/mod) → BiQuadFilter (low-pass resonante) → Pan L/R × master_volume (0.5)",
      rows: [
        ["Renderizado por bloques de 64 muestras", "En meltysynth.py L3461, _render_block sintetiza de 64 en 64 muestras para actualizar envolventes y filtros a tasa de control (~689 Hz) y interpola linealmente la ganancia (previous_gain → current_gain) para evitar clics."],
        ["Búsqueda bit-wise de presets (L3247)", "Empaqueta banco y programa en un entero de 32 bits: preset_id = (bank_number << 16) | patch_number para buscar el timbre en O(1)."]
      ]
    },
    {
      cat: "radiografia",
      tag: "Documentación · README.md L30–36",
      pill: "Transparencia académica",
      pillCls: "comp-pill--const",
      title: "51. Declaración de IA y autoría intelectual del equipo",
      ref: "README.md: sección DECLARACIÓN DE IA",
      rows: [
        ["Qué documenta el README", "1) Investigación de alternativas de síntesis en Python puro (eligiendo meltysynth) mientras music21 provino de investigación propia; 2) Apoyo con documentación de renderizado WAV y patrón de función envoltorio para no triplicar código; 3) Verificación de errores y casos límite."],
        ["Núcleo algorítmico del curso", "La formulación del Movimiento Browniano, la implementación completa de NodoHeap/HeapMax, las progresiones armónicas y las reglas/poda del Backtracking articulan los temas centrales de Algoritmos y Estructuras de Datos."]
      ]
    },
    {
      cat: "radiografia",
      tag: "Trazabilidad · propuesta/propuesta.pdf",
      pill: "Alcance superado",
      pillCls: "comp-pill--const",
      title: "52. Relación exacta entre propuesta.pdf y la entrega final",
      ref: "De generador textual de escalas a sintetizador algorítmico comparativo",
      rows: [
        ["Qué se conservó de la propuesta", "La construcción algorítmica de escalas mayores y menores por patrones de semitonos desde cualquier tónica (implementado en L35–64)."],
        ["Cuánto creció el alcance", "En lugar de quedarse en imprimir notas en texto, se añadieron 4 instrumentos polifónicos, caminata browniana, HeapMax propio, Voraz armónico, Backtracking con Branch & Bound y renderizado DSP a WAV estéreo."]
      ]
    },

    // =====================================================
    // 6. LIBRERÍAS, SOUNDFONT Y ENTORNO (6 FICHAS)
    // =====================================================
    {
      cat: "librerias",
      tag: "Librería · L4",
      pill: "music21",
      pillCls: "comp-pill--const",
      title: "53. music21 (MIT): objetos Pitch e Interval",
      ref: "from music21 import interval, pitch",
      rows: [
        ["Qué resuelve exactamente", "Traduce nombres simbólicos ('C#3') a números MIDI (49) y aplica transposiciones cromáticas exactas con interval.Interval(semitonos).transposePitch(p_base)."],
        ["Aislamiento de rendimiento", "music21 es pesado si se llama miles de veces; por eso el código lo confina al arranque (168 llamadas en escalas + 12 en mapa_midi = 180 llamadas fijas O(1))."]
      ]
    },
    {
      cat: "librerias",
      tag: "Sintetizador · L3, L645",
      pill: "meltysynth + SF2",
      pillCls: "comp-pill--nlogn",
      title: "54. meltysynth.py + FluidR3_GM.sf2 (Estándar SoundFont 2.01)",
      ref: "ms.SoundFont.from_file('assets/FluidR3_GM.sf2') · ms.Synthesizer(sf2, settings)",
      rows: [
        ["Qué hay dentro de FluidR3_GM.sf2", "Un contenedor RIFF ('sfbk') con muestras reales grabadas en estudio de los 128 instrumentos General MIDI, puntos de loop y parámetros de envolvente/filtro."],
        ["Por qué se carga 1 sola vez en L645", "Parsear el archivo binario .sf2 (~141 MB) toma memoria y disco; al guardar la instancia sf2 y pasarla por referencia a los 3 renders, solo se lee del disco una vez."]
      ]
    },
    {
      cat: "librerias",
      tag: "Cálculo vectorial · L5",
      pill: "NumPy",
      pillCls: "comp-pill--linear",
      title: "55. numpy: por qué usamos float32 en síntesis e int16 al exportar",
      ref: "np.zeros(..., np.float32) · np.column_stack · np.clip · .astype(np.int16)",
      rows: [
        ["Ahorro del 50% de RAM frente a float64", "Por defecto np.zeros usa float64 (8 bytes); pedir explícitamente dtype=np.float32 corta a la mitad la memoria de left y right manteniendo 24 bits de mantisa (>140 dB, superior a los 96 dB de 16-bit PCM)."]
      ]
    },
    {
      cat: "librerias",
      tag: "Audio I/O · L6",
      pill: "SciPy",
      pillCls: "comp-pill--linear",
      title: "56. scipy.io.wavfile.write: compatibilidad universal sin códecs",
      ref: "wavfile.write(ruta_wav, settings.sample_rate, stereo_pcm16)",
      rows: [
        ["Por qué WAV PCM int16 y no MP3/OGG", "WAV PCM 16-bit no tiene pérdida por compresión psicoacústica, no requiere instalar FFmpeg externo y es reproducible nativamente por Windows, macOS, Linux y navegadores HTML5."]
      ]
    },
    {
      cat: "librerias",
      tag: "Stdlib Python · L1–2",
      pill: "CPython C-ext",
      pillCls: "comp-pill--const",
      title: "57. random (Mersenne Twister) y collections.defaultdict",
      ref: "random.uniform · random.gauss · defaultdict(list)",
      rows: [
        ["Mersenne Twister MT19937", "Generador estándar de Python implementado en C con período colosal 2^19937 - 1 y equidistribución en 623 dimensiones."],
        ["defaultdict(list) en C", "Implementado en el módulo _collections en C: inserta y devuelve [] automáticamente cuando la clave m_on/m_off no existe aún."]
      ]
    },
    {
      cat: "librerias",
      tag: "Entorno de ejecución",
      pill: "Python ≥ 3.10",
      pillCls: "comp-pill--const",
      title: "58. Requisitos exactos de versión de Python y directorio de trabajo",
      ref: "match command: (meltysynth.py L3279) · NodoHeap | None (L227) · list[str] (L43)",
      rows: [
        ["Por qué exige Python 3.10 o superior", "Tanto el operador unión de tipos X | None (PEP 604) en el script principal como la sentencia estructural match / case (PEP 634) dentro de meltysynth.py L3279 fueron introducidos en Python 3.10."],
        ["Directorio de ejecución", "Debe ejecutarse posicionado en proyecto_final/ para que la ruta relativa 'assets/FluidR3_GM.sf2' (L645) resuelva directamente."]
      ]
    },

    // =====================================================
    // 7. MODO PARANOIA: AUDITORÍA FORENSE Y DETALLES OCULTOS (14 FICHAS)
    // =====================================================
    {
      cat: "paranoia",
      tag: "Forense #1 · L257–281",
      pill: "Secreto del Voraz",
      pillCls: "comp-pill--exp",
      title: "59. ¿Cómo usa realmente algoritmo_voraz_para_aproximar a secuencia_base?",
      ref: "for paso_idx, (simbolo, dur_ql) in enumerate(secuencia_base):",
      snippet: "# Usa paso_idx, dur_ql y verifica si simbolo == 'rest';\n# prioridad = -(dist_objetivo + 0.5 * dist_anterior) depende de progresion y grado_actual",
      rows: [
        ["Qué ocurre exactamente en el código", "En los pulsos activos, la prioridad evalúa la distancia a progresion[paso_idx] y a grado_actual (que arranca en 0). Por eso secuencia_base actúa como esqueleto rítmico de N pulsos y duraciones dur_ql."],
        ["Consecuencia audible directa", "En voraz.wav, guitarra y campana tocan al unísono la conducción óptima pura de La Folía o Quintas (y bajo + steel drums tocan su 3ª en pares), funcionando como referencia armónica ideal frente a backtracking.wav."],
        ["Si el jurado pide acoplarlo al azar en 1 línea", "Basta sumar + 0.3 * dist_base en L272, donde dist_base mide la distancia circular entre idx_nota e indice_para_la_nota[simbolo]."]
      ]
    },
    {
      cat: "paranoia",
      tag: "Forense #2 · L88 vs L289",
      pill: "% 6 vs % 7",
      pillCls: "comp-pill--exp",
      title: "60. Por qué el Browniano usa % 6 (0..5) mientras Voraz y DFS usan % 7 (0..6)",
      ref: "L88: int(x * 100) % 6   vs   L262/L459: ... % num_grados (7)",
      snippet: "aleatorio_bruto.wav → usa grados {0,1,2,3,4,5} (hexatónica, sin 7º grado sensible)\nvoraz.wav y backtracking.wav → usan los 7 grados {0,1,2,3,4,5,6}",
      rows: [
        ["Efecto musical curioso", "En aleatorio_bruto.wav nunca suena el índice 6 (la sensible, ej. B3 en Do mayor, que es la nota más tensa), suavizando ligeramente el azar puro; en cambio La Folía [0,4,0,6,2,6,0,4] y los saltos +2/+4/+6 en Backtracking sí desbloquean el 7º grado completo."],
        ["Si preguntan cómo incluir el 7º en bruto", "Cambiar % 6 por % 7 (o % len(escala_actual)) en L88–89, L104–105, L120–121 y L136–137."]
      ]
    },
    {
      cat: "paranoia",
      tag: "Forense #3 · L409 vs README L26",
      pill: "max_septimas = 1",
      pillCls: "comp-pill--exp",
      title: "61. Diferencia entre README ('dos séptimas') y código real (max_septimas: int = 1)",
      ref: "PROYECTO_FINAL_MUSICA_ESTOCASTICA.py L409 vs README.md L26",
      snippet: "def reestricciones_de_la_siguiente_nota(..., max_terceras=2, max_quintas=2, max_septimas=1):",
      rows: [
        ["Por qué en el código vale 1 y es mejor así", "1) Acústicamente, dos séptimas seguidas crean disonancia áspera; 2) Algorítmicamente, como 7a (+6 mod 7) tiene el costo mínimo dist = 1, si permitiéramos 2 seguidas dominaría casi toda la pieza. Poner max_septimas = 1 obliga a alternar 7a con 3a y enriquece la melodía."]
      ]
    },
    {
      cat: "paranoia",
      tag: "Forense #4 · L77, 93, 109, 125",
      pill: "Semilla en def",
      pillCls: "comp-pill--const",
      title: "62. Evaluación en tiempo de definición de inicio=random.uniform(-1.0, 1.0)",
      ref: "def movimiento_browniano_bajo(n: int, inicio=random.uniform(-1.0, 1.0), paso: float = 1.0):",
      rows: [
        ["Regla sutil de Python", "En Python los valores por defecto de los argumentos se evalúan UNA sola vez cuando el intérprete ejecuta la sentencia def, no en cada llamada."],
        ["Por qué en nuestro script NO causa colisión", "Porque existen 4 bloques def distintos (uno por instrumento) y cada uno se invoca exactamente 1 vez: Python evalúa 4 veces random.uniform(-1.0, 1.0), dando 4 puntos iniciales independientes."],
        ["Cómo escribirlo si se unificara en 1 sola función", "Usar inicio: float | None = None y dentro del cuerpo if inicio is None: inicio = random.uniform(-1.0, 1.0)."]
      ]
    },
    {
      cat: "paranoia",
      tag: "Forense #5 · L50–51, L526",
      pill: "Enarmonía music21",
      pillCls: "comp-pill--const",
      title: "63. Nombres internos con bemol ('E-3') de music21 y orden de alturas",
      ref: "pitch.Pitch(midi=midi_fijado).nameWithOctave",
      snippet: "Para C menor [0,2,3,5,7,8,10] → MIDI [48,50,51,53,55,56,58]\nmusic21 nombra MIDI 51 como 'E-3' (Mi bemol), 56 como 'A-3' y 58 como 'B-3'",
      rows: [
        ["¿Rompe esto la prohibición de bemoles en la entrada?", "¡No! La restricción de entrada (L18) solo aplica al string que escribe el usuario en consola; internamente todos los diccionarios (indice_para_la_nota y mapa_midi) se construyen leyendo las cadenas exactas generadas por escala_por_intervalos, por lo que hay consistencia 100%."],
        ["Inversión de octava en tónicas distintas de C", "En G mayor, C3 (MIDI 48) suena más grave que G3 (MIDI 55) porque toda la escala vive en [48..59]: es lo que en teoría musical se llama disposición cerrada en una octava."]
      ]
    },
    {
      cat: "paranoia",
      tag: "Forense #6 · L70–72 vs L588–605",
      pill: "IEEE 754 Float",
      pillCls: "comp-pill--const",
      title: "64. ¿Puede activarse eventos_fuera_de_rango por precisión IEEE 754?",
      ref: "seg_por_ql_local = 60.0 / 140.0 · if onset_s >= duracion_s or offset_s > duracion_s:",
      snippet: "En float64: 60.0 / 140.0 = 0.4285714285714285476...\nPara múltiplos exactos (ej. duracion=12 s, N=28): 28 * (60.0/140.0) = 12.0 exacto, pero acumulaciones de dur_ql pueden rozar 12.000000000000002",
      rows: [
        ["Por qué L588–605 es brillante", "En aritmética binaria IEEE 754, 3/7 no tiene representación finita en base 2. Al sumar cursor_ql y multiplicar por 60.0/140.0, offset_s podría exceder duracion_s por 10^-15 segundos; el clamp min(num_muestras, ...) evita un IndexError en NumPy."]
      ]
    },
    {
      cat: "paranoia",
      tag: "Forense #7 · meltysynth.py L3258",
      pill: "Trampa Canal 9",
      pillCls: "comp-pill--const",
      title: "65. Por qué asignamos canales 0, 1, 2 y 3 (y evitamos el canal MIDI 9)",
      ref: "Synthesizer._PERCUSSION_CHANNEL = 9 (canal 10 en numeración humana 1..16)",
      snippet: "self._channels.append(_Channel(self, i == Synthesizer._PERCUSSION_CHANNEL))",
      rows: [
        ["Qué habría pasado si usábamos channel 9", "En el estándar General MIDI, el canal 9 (índice 0-based) está cableado al banco 128 de batería no afinada (C3=bombo/tom, F#3=hi-hat) e ignora escalas melódicas."],
        ["Por qué channel 3 funciona para Steel Drums", "Steel Drums (program 114) es percusión melódica afinada: necesita un canal melódico normal (como el 3) para respetar exactamente las notas de escala_actual."]
      ]
    },
    {
      cat: "paranoia",
      tag: "Forense #8 · L449–453",
      pill: "Memoria en silencios",
      pillCls: "comp-pill--const",
      title: "66. Cómo se comportan las rachas (r3, r5, r7) durante los silencios en DFS",
      ref: "dfs(paso + 1, siguiente_nota3, siguiente_nota5, siguiente_nota7, costo_acum)",
      rows: [
        ["Comportamiento exacto", "Cuando a un instrumento le toca 'rest' por su turno modular, dfs pasa exactamente los mismos contadores (r3, r5, r7) al paso + 1 sin ponerlos en cero."],
        ["Sentido musical", "El oído recuerda el último intervalo melódico que tocó ese instrumento aunque haya habido un pulso de silencio en medio; así evita que la guitarra o la campana repitan eternamente 7a cada vez que entran."]
      ]
    },
    {
      cat: "paranoia",
      tag: "Forense #9 · L598",
      pill: "Guardia m_off > m_on",
      pillCls: "comp-pill--const",
      title: "67. Por qué L598 exige estrictamente m_off > m_on",
      ref: "if m_off <= num_muestras and m_off > m_on: acciones_por_muestra[m_off].append(('off', ...))",
      rows: [
        ["Qué bug previene", "Si una nota tuviera dur_ql = 0 o quedara truncada al final tal que m_off == m_on, en ese mismo instante se ordenaría primero 'off' (que no apagaría nada) y luego 'on' ¡dejando la nota encendida para siempre sin futuro note_off!"]
      ]
    },
    {
      cat: "paranoia",
      tag: "Forense #10 · Stack CPython",
      pill: "141 << 1000 frames",
      pillCls: "comp-pill--const",
      title: "68. ¿Puede dfs() provocar RecursionError (Stack Overflow) en Python?",
      ref: "sys.getrecursionlimit() == 1000 vs profundidad máxima n_pasos + 1",
      rows: [
        ["Prueba matemática de imposibilidad", "La validación L11 impone duracion <= 60, lo cual implica n_pasos = radio_de_notas <= 140. El árbol DFS tiene profundidad exacta n_pasos + 1 <= 141 llamadas anidadas, más de 7 veces por debajo del límite de 1 000 marcos de CPython."]
      ]
    },
    {
      cat: "paranoia",
      tag: "Forense #11 · L615–618",
      pill: "Estabilidad Timsort",
      pillCls: "comp-pill--const",
      title: "69. Por qué importa que sorted() sea un algoritmo estable en L615",
      ref: "acciones_ordenadas = sorted(acciones_por_muestra[t_actual], key=lambda x: 0 if x[0] == 'off' else 1)",
      rows: [
        ["Propiedad de estabilidad", "La función key solo devuelve dos valores posibles (0 o 1). Como Timsort es estable, todos los eventos 'off' conservan su orden original de canal (0 → 1 → 2 → 3) y todos los 'on' también, haciendo la asignación de voces en MeltySynth 100% determinista."]
      ]
    },
    {
      cat: "paranoia",
      tag: "Forense #12 · Entradas hostiles",
      pill: "Pruebas de estrés",
      pillCls: "comp-pill--const",
      title: "70. Matriz completa de entradas límite y qué excepción lanza cada una",
      ref: "Auditoría de robustez en consola (L10–30 y L645)",
      snippet: "duracion='3' → OK (N=7) | duracion='60' → OK (N=140) | duracion='2' o '61' → ValueError propio\nduracion='10.5' o 'abc' → ValueError nativo de int() | nota='Bb' o 'c' → ValueError propio",
      rows: [
        ["Espacios accidentales ('C ')", "Como input() no aplica .strip(), escribir 'C ' con espacio al final no coincide con notas_validas y lanza el ValueError informativo de L23."],
        ["Falta de FluidR3_GM.sf2", "Si no existe assets/FluidR3_GM.sf2, open() dentro de SoundFont.from_file lanza FileNotFoundError antes de sintetizar."]
      ]
    },
    {
      cat: "paranoia",
      tag: "Forense #13 · Desempates",
      pill: "Heap vs DFS",
      pillCls: "comp-pill--const",
      title: "71. Cómo desempatan exactamente HeapMax vs Backtracking ante costos iguales",
      ref: "L206 (prioridad >) vs L461 (-orden_de_elegir_el_grado)",
      rows: [
        ["En HeapMax (Voraz)", "Tanto flotar como hundir usan desigualdad estricta (>). Si dos grados tienen exactamente la misma prioridad (ej. D3 y B3 con -1.5 frente a C3), gana el que tenía menor índice inicial en candidatos (más cercano al grado 0)."],
        ["En Backtracking", "Desempata explícitamente con -orden_de_elegir_el_grado: prefiere 7a (3) > 5a (2) > 3a (1), tal como especifica el README ('si la distancia es igual se irá al grado mayor')."]
      ]
    },
    {
      cat: "paranoia",
      tag: "Forense #14 · Identificadores",
      pill: "Nombres exactos",
      pillCls: "comp-pill--const",
      title: "72. Ortografía exacta de variables y funciones en el código fuente",
      ref: "Para buscar con Ctrl+F en vivo sin fallar si el jurado pide abrir el .py",
      snippet: "valors_aislados_bajo (sin 'e') | calcular_la_disancia_entre_dos_grado (sin 't')\nreestricciones_de_la_siguiente_nota (doble 'e') | dedtln ('duración estándar de todas las notas')",
      rows: [
        ["Por qué tenerlo presente", "Si el profesor pide buscar una función en el editor durante la defensa, escribir el identificador exacto del código fuente demuestra dominio total del archivo entregado."]
      ]
    },

    // =====================================================
    // 8. DEFENSA / PREGUNTAS DE JURADO Y EXAMEN (24 FICHAS)
    // =====================================================
    {
      cat: "defensa",
      tag: "Pregunta de jurado #1 · Estructuras",
      pill: "Heap propio",
      pillCls: "comp-pill--linear",
      title: "73. ¿Por qué programaron HeapMax desde cero en vez de usar heapq o max()?",
      ref: "Defensa de estructuras · L161–238",
      rows: [
        ["Respuesta blindada", "Por tres razones técnicas y académicas: 1) En Algoritmos y Estructuras de Datos demuestra implementación real de montículos binarios en arreglos (construcción de Floyd O(G), flotar y hundir); 2) heapq de Python solo implementa min-heap; 3) Nuestra clase NodoHeap mantiene nodo.indice actualizado en cada swap, dejando lista la estructura para operaciones de cambio de prioridad en O(log G)."],
        ["Remate corto", "Con G=7 max() también sería O(1), pero HeapMax escala logarítmicamente O(log G) si el espacio de acordes o microtonos crece a cientos de candidatos."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #2 · Trampa clásica",
      pill: "O(N) vs O(N log N)",
      pillCls: "comp-pill--const",
      title: "74. Si usan un Heap logarítmico en cada nota, ¿por qué el Voraz es O(N) y no O(N log N)?",
      ref: "Defensa asintótica · ANALISIS_DE_COMPLEJIDAD.txt L21–24",
      rows: [
        ["Respuesta blindada", "Porque el tamaño del heap NO es N (la cantidad de notas de la canción), sino G = 7 (los 7 grados de la escala diatónica). En cada uno de los N pulsos hacemos O(G + log G) = O(7 + log₂ 7) = O(1) trabajo constante. Multiplicado por N pulsos, N × O(1) = O(N) lineal."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #3 · Poda",
      pill: "3^140 → ≤ 4000",
      pillCls: "comp-pill--exp",
      title: "75. Si Backtracking es O(3^N), ¿cómo no explota con 60 segundos (N = 140 notas)?",
      ref: "Defensa de Branch & Bound · L431–492",
      rows: [
        ["Respuesta blindada", "Porque combinamos 4 mecanismos que aplastan la explosión combinatoria: 1) División modular de turnos (guitarra, campana y drums no ramifican en los silencios); 2) Restricciones de racha (cuando r3=2, r5=2 o r7=1 solo queda 1 rama válida, no 3); 3) Ordenamiento heurístico (.sort() explora primero 7a de costo 1, hallando enseguida una cota muy baja para podar con nuevo_costo >= mejor_costo); y 4) Un interruptor de tiempo real max_nodos = 4000 con respaldo determinista."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #4 ·Pregunta estrella",
      pill: "DP vs Backtracking",
      pillCls: "comp-pill--exp",
      title: "76. ¿Se podría haber resuelto el problema de Backtracking con Programación Dinámica?",
      ref: "Pregunta de nivel avanzado de Algoritmos",
      rows: [
        ["Respuesta blindada (de 100/100)", "¡Sí! Como el costo es aditivo y el futuro solo depende de la tupla de estado (paso, r3, r5, r7) donde r3 ∈ {0,1,2}, r5 ∈ {0,1,2} y r7 ∈ {0,1}, solo existen 3 × 3 × 2 = 18 estados posibles por paso (y de hecho a lo sumo 6 alcanzables porque solo una racha puede ser > 0 a la vez). Con DP/Viterbi costaría O(N) exacto."],
        ["Por qué elegimos Backtracking con Poda", "Porque el objetivo formativo del proyecto era contrastar explícitamente los dos paradigmas de búsqueda vistos en clase —Voraz con Heaps vs. Backtracking en árbol con poda Branch & Bound— y observar cómo la heurística y la poda doman un árbol exponencial O(3^N)."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #5 · Optimalidad",
      pill: "Voraz ≠ Óptimo global",
      pillCls: "comp-pill--linear",
      title: "77. ¿El Algoritmo Voraz garantiza siempre la secuencia de menor costo global?",
      ref: "Propiedad de elección voraz · L269–281",
      rows: [
        ["Respuesta blindada", "Para la función local de un paso sí elige el máximo exacto, pero globalmente a lo largo de toda la canción una decisión voraz modifica grado_actual para el paso i+1. Si factor_paso fuera grande (>1.0), ahorrar distancia hoy podría dejarnos lejos del acorde de mañana; con nuestro factor_paso = 0.5 <= 1.0, por desigualdad triangular siempre elige exactamente el grado de la progresión armónica."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #6 · Exactitud DFS",
      pill: "Exacto vs Anytime",
      pillCls: "comp-pill--exp",
      title: "78. ¿Cuándo garantiza Backtracking el óptimo global exacto y cuándo una aproximación?",
      ref: "Bandera limite_alcanzado · L426, L438–440",
      rows: [
        ["Respuesta blindada", "Mientras al terminar se cumpla limite_alcanzado == False (es decir, el árbol podado completo requirió ≤ 4 000 nodos, como ocurre en duraciones cortas o en instrumentos con más silencios como steel drums y campana), la solución devuelta es matemáticamente el óptimo global exacto. Si se activa limite_alcanzado == True, actúa como un algoritmo anytime devolviendo la mejor solución incumbente hallada hasta el nodo 4 000."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #7 · Teoría de algoritmos",
      pill: "B&B vs Backtracking",
      pillCls: "comp-pill--exp",
      title: "79. ¿Su algoritmo es Backtracking puro o Branch & Bound (Ramificación y Poda)?",
      ref: "L403 (factibilidad) + L434/467 (optimalidad)",
      rows: [
        ["Respuesta blindada", "Combina ambos: usa Backtracking para satisfacer restricciones duras de factibilidad (reestricciones_de_la_siguiente_nota) deshaciendo estados con pop(), y añade una cota superior dinámica mejor_costo para podar subárboles subóptimos (nuevo_costo >= mejor_costo), lo cual es exactamente Branch & Bound con recorrido DFS."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #8 · Audio / MIDI",
      pill: "Orden en colisión",
      pillCls: "comp-pill--nlogn",
      title: "80. ¿Por qué ordenan 'off' antes que 'on' cuando caen en la misma muestra?",
      ref: "key=lambda x: 0 if x[0] == 'off' else 1 · L615–625",
      rows: [
        ["Respuesta blindada", "Porque nuestras notas son contiguas: el instante en que termina la nota k es exactamente el instante en que empieza la nota k+1. Si un canal repite la misma nota (ej. C3 seguida de C3) y enviáramos primero note_on(C3) y enseguida note_off(C3) en el mismo sample, MeltySynth apagaría ambas voces dejando un hueco de silencio."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #9 · Estocásticos",
      pill: "Browniano vs Markov",
      pillCls: "comp-pill--linear",
      title: "81. ¿Por qué eligieron Movimiento Browniano en lugar de Cadenas de Markov o randint?",
      ref: "Justificación del modelo generativo · L74–85",
      rows: [
        ["Respuesta blindada", "random.randint es ruido blanco uniforme sin relación entre una nota y la siguiente. Una Cadena de Markov requeriría definir a mano una matriz de transición 7×7 (que ya impondría reglas armónicas artificiales en la señal base). El Movimiento Browniano nos da continuidad física natural sin reglas tonales previas, ideal como línea base justa para medir qué tanto aportan luego Voraz y Backtracking."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #10 · Heurística DFS",
      pill: "Impacto de .sort()",
      pillCls: "comp-pill--exp",
      title: "82. ¿Qué pasaría si borráramos la línea candidatos_ordenados.sort() (L463) en Backtracking?",
      ref: "Importancia del orden de exploración en Branch & Bound",
      rows: [
        ["Respuesta blindada", "Sin .sort(), el bucle recorrería ['3a', '5a', '7a'] en ese orden fijo: bajaría primero por puras 3as y 5as (costos 2 y 3), estableciendo una primera cota mejor_costo muy alta (mala). Eso debilitaría enormemente la poda if nuevo_costo >= mejor_costo y agotaría los 4 000 nodos mucho antes. Ordenar primero el menor costo (7a cuesta 1) tensa la cota desde la primera hoja."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #11 · Hiperparámetros",
      pill: "factor_paso",
      pillCls: "comp-pill--linear",
      title: "83. ¿Qué pasa si cambiamos factor_paso = 0.5 a 0.0 o a 10.0 en el Voraz?",
      ref: "prioridad = -(dist_objetivo + factor_paso * dist_anterior) · L251, L272",
      rows: [
        ["Respuesta blindada", "Con factor_paso = 0.0 ignora por completo de qué nota veníamos (cero costo por saltos bruscos). Con factor_paso = 10.0 penaliza tanto moverse que dist_anterior = 0 domina siempre y el instrumento se queda congelado repitiendo la tónica inicial toda la canción. 0.5 pondera 2:1 la armonía sobre la cercanía melódica."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #12 · Estructuras dispersas",
      pill: "Hash vs Arreglo S",
      pillCls: "comp-pill--nlogn",
      title: "84. ¿Por qué acciones_por_muestra es un defaultdict y no una lista de longitud S?",
      ref: "Estructura dispersa (sparse) vs densa · L582, L609",
      rows: [
        ["Respuesta blindada", "Porque para 60 segundos hay S = 2 646 000 muestras, pero solo cambian notas cada 0.428 s (~141 muestras activas: el 99.995% de las muestras no tienen eventos MIDI). Un defaultdict guarda únicamente las ~141 muestras con eventos y nos permite saltar en render() de evento en evento en tramos de ~18 900 muestras de golpe."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #13 · Variables de costo",
      pill: "Por qué aparece S",
      pillCls: "comp-pill--nlogn",
      title: "85. ¿Por qué escriben O(N log N + S) con dos variables si tanto N como S dependen de duracion?",
      ref: "Análisis multivariable de algoritmos · L68–72, L575",
      rows: [
        ["Respuesta blindada", "Porque representan dos dominios físicos distintos con constantes enormes de diferencia: N = ⌊duracion · bpm / 60⌋ es la cantidad de eventos simbólicos (~2.33 por segundo), mientras S = duracion · sample_rate es la cantidad de muestras acústicas (44 100 por segundo). Si expresamos todo en función únicamente de duracion D con BPM y Fs fijos, ambos son Θ(D log D + D) = Θ(D log D) asintótico, pero en la práctica S es ~18 900 veces mayor que N."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #14 · Lenguaje Python",
      pill: "Alcance nonlocal",
      pillCls: "comp-pill--const",
      title: "86. ¿Qué hace exactamente nonlocal en dfs() (L429) y por qué no usaron global?",
      ref: "nonlocal mejor_costo, mejor_secuencia, nodos_visitados, limite_alcanzado",
      rows: [
        ["Respuesta blindada", "nonlocal enlaza las variables al ámbito de la función envolvente poda_de_backtracking, no al módulo global. Gracias a eso, cada una de las 4 llamadas (bajo, guitarra, campana, steel drums) arranca con su propio mejor_costo = inf y nodos_visitados = 0 limpios y encapsulados, sin contaminar el estado de los otros instrumentos."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #15 · Concurrencia",
      pill: "GIL vs Multiprocessing",
      pillCls: "comp-pill--nlogn",
      title: "87. ¿Se podrían generar los 3 archivos .wav en paralelo para tardar un tercio del tiempo?",
      ref: "Arquitectura de ejecución · L645–678",
      rows: [
        ["Respuesta blindada", "Con hilos (threading) NO ganaría velocidad porque meltysynth.py es código CPU-bound en Python puro y el Global Interpreter Lock (GIL) de CPython serializa los bytecodes. En cambio, con multiprocessing.Pool(3) (3 procesos independientes de sistema operativo) SÍ lograríamos casi 3× de aceleración en un procesador multinúcleo, porque las 3 síntesis son completamente independientes entre sí."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #16 · Comparación audible",
      pill: "Los 3 audios",
      pillCls: "comp-pill--linear",
      title: "88. Si escuchamos los 3 .wav a ciegas, ¿cómo distinguimos cuál generó cada algoritmo?",
      ref: "aleatorio_bruto.wav vs voraz.wav vs backtracking.wav",
      rows: [
        ["aleatorio_bruto.wav", "Suena denso y caótico: los 4 instrumentos tocan sin parar en todos los pulsos sin silencios ni centro tonal compartido."],
        ["voraz.wav", "Suena ordenado, solemne y predecible: sigue claramente la cadencia clásica de La Folía o Quintas con respuesta rítmica par/impar del bajo y percusión."],
        ["backtracking.wav", "Suena polifónico, aireado y variado: los instrumentos entran escalonados (mod 1, 2, 3, 4), conservan la huella estocástica inicial de cada pista pero transformada en intervalos limpios sin repeticiones monótonas."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #17 · Índices del Heap",
      pill: "Aritmética 0-based",
      pillCls: "comp-pill--const",
      title: "89. ¿Cómo demuestran rápido en el pizarrón las fórmulas padre=(i-1)//2 e hijos 2i+1, 2i+2?",
      ref: "L161–168 de PROYECTO_FINAL_MUSICA_ESTOCASTICA.py",
      rows: [
        ["Respuesta blindada", "En un árbol binario lleno indexado desde 1, los hijos de k son 2k y 2k+1, y el padre es k//2. Al desplazar todos los índices 1 posición a la izquierda para empezar en 0 (i = k - 1 → k = i + 1), los hijos pasan a ser 2(i+1) - 1 = 2i + 1 y 2(i+1) = 2i + 2, e invirtiendo cualquiera de las dos con división entera obtenemos exactamente (i - 1) // 2."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #18 · Audio digital",
      pill: "Mezcla sin distorsión",
      pillCls: "comp-pill--const",
      title: "90. ¿Por qué no satura horriblemente el audio cuando suenan los 4 instrumentos al mismo tiempo?",
      ref: "Control de ganancia en 3 etapas · L150, meltysynth L3269, L637",
      rows: [
        ["Respuesta blindada", "Por tres márgenes de seguridad (headroom): 1) Usamos velocity = 70 (moderado sobre 127); 2) MeltySynth aplica internamente _master_volume = 0.5 al mezclar las voces en float; 3) Al convertir a entero de 16 bits aplicamos np.clip(..., -32768, 32767) para impedir cualquier desbordamiento aritmético."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #19 · Diseño musical",
      pill: "Octava 3 fija",
      pillCls: "comp-pill--const",
      title: "91. ¿Por qué todas las notas viven en la octava 3 (C3..B3) para los 4 instrumentos?",
      ref: "construir_repositorio_escalas(octava=3) · L63",
      rows: [
        ["Respuesta blindada", "Porque modelamos clases de altura (pitch classes) sobre un anillo circular Z_7 sin saltos de octava que distorsionen las distancias entre grados; aun recibiendo la misma octava MIDI 3, el banco SoundFont FluidR3 aplica el timbre, formantes y envolvente real de bajo fretless, guitarra jazz, campana tubular y steel drums."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #20 · Testing",
      pill: "Semillas y pruebas",
      pillCls: "comp-pill--const",
      title: "92. Si el proyecto es estocástico (aleatorio), ¿cómo se prueba que los algoritmos funcionan bien?",
      ref: "Estrategia de verificación determinista sobre entradas estocásticas",
      rows: [
        ["Respuesta blindada", "Separando generación de optimización: tanto algoritmo_voraz_para_aproximar como poda_de_backtracking son 100% deterministas una vez dada secuencia_base. Pasándoles una lista fija pequeña (como [E3, D3, A3] en nuestra traza) o fijando random.seed(k) antes de ejecutar, la salida y el costo óptimo son completamente reproducibles y verificables a mano."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #21 · Caso extremo",
      pill: "10 minutos de audio",
      pillCls: "comp-pill--exp",
      title: "93. ¿Qué se rompería primero si quitáramos el límite de 60 s y pidiéramos 10 minutos (600 s)?",
      ref: "Análisis de límites de arquitectura · L11, L428, L575",
      rows: [
        ["Respuesta blindada", "Con 600 s tendríamos N = 1 400 notas/canal y S = 26 460 000 muestras: 1) El primero en fallar sería dfs() en el canal del bajo al llegar al paso ~998 por el límite por defecto sys.getrecursionlimit() = 1000 de Python (solución: subir el límite o pasar DFS a pila iterativa); 2) Los buffers NumPy ocuparían ~530 MB de RAM pico (aún manejable); 3) El renderizado en Python puro tardaría un par de minutos."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #22 · Caché vs Recálculo",
      pill: "Precomputación",
      pillCls: "comp-pill--const",
      title: "94. ¿Por qué precalcularon las 24 escalas en repositorio_escalas si el usuario solo pide una?",
      ref: "construir_repositorio_escalas() · L55–64, L526–530",
      rows: [
        ["Respuesta blindada", "Dos ventajas: 1) Cuesta apenas 168 iteraciones fijas (milisegundos, Θ(1)) y deja lista una arquitectura tipo servidor/API donde se puedan generar múltiples canciones en cualquier tonalidad sin recalcular; 2) Alimenta directamente mapa_midi (L526) cubriendo los 12 semitonos cromáticos de una sola vez."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #23 · Evolución",
      pill: "Futuro v2.0",
      pillCls: "comp-pill--linear",
      title: "95. Si continuaran el proyecto hacia una versión 2.0, ¿qué mejoras puntuales aplicarían?",
      ref: "Autocrítica constructiva de ingeniería",
      rows: [
        ["4 mejoras concretas", "1) Unificar las 4 funciones brownianas en una sola con inicio=None evaluado en tiempo de llamada y módulo % 7 completo; 2) Agregar un término de fidelidad a la nota browniana (+ α·dist_base) dentro de la prioridad del Voraz; 3) Envolver input() y la carga .sf2 en bloques try/except amigables; 4) Paralelizar los 3 renders WAV con multiprocessing o añadir una opción DP O(N) junto al Backtracking."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #24 · Ética y autoría",
      pill: "Uso de IA y Propuesta",
      pillCls: "comp-pill--const",
      title: "96. ¿Cómo integraron las herramientas de investigación/IA y cómo evolucionó desde la propuesta?",
      ref: "README.md L30–36 + propuesta/propuesta.pdf",
      rows: [
        ["Respuesta transparente", "Tal como documentamos en la Declaración de IA del README: usamos IA como apoyo para descubrir que meltysynth permitía sintetizar SoundFonts en Python puro sin dependencias C++, consultar su interfaz de renderizado por buffers, estructurar la función envoltorio para no triplicar código y revisar casos límite; mientras que music21, la elección de La Folía/Quintas, la estructura HeapMax y las reglas de Backtracking nacieron de expandir nuestra propuesta inicial de escalas hacia un comparador algorítmico audible completo."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #25 · Contexto histórico",
      pill: "Iannis Xenakis",
      pillCls: "comp-pill--const",
      title: "97. ¿Quién fue Iannis Xenakis, qué es Metastaseis y cómo inspira nuestro código?",
      ref: "Contexto musical · Años 1950 (Metastaseis, 1953–1954) → L66–138",
      rows: [
        ["Origen de la música estocástica", "Iannis Xenakis (compositor, ingeniero y arquitecto) introdujo en los años 50 la música estocástica usando leyes estadísticas de gases (Maxwell-Boltzmann), movimiento browniano y probabilidad para modelar masas sonoras en vez de elegir cada nota manualmente."],
        ["Por qué surgió Metastaseis", "Nació como reacción frente al serialismo integral, que Xenakis consideraba excesivamente determinista y restrictivo en su control lineal pero caótico al oído."],
        ["Puente directo con nuestro proyecto", "En nuestro código (L74–138), random.gauss(0.0, paso) modela ese mismo movimiento browniano de partículas como materia prima, y luego comparamos dos formas computacionales de darle orden armónico."]
      ]
    },
    {
      cat: "defensa",
      tag: "Pregunta de jurado #26 · Teoría → Código",
      pill: "5 Conceptos Musicales",
      pillCls: "comp-pill--linear",
      title: "98. ¿Cómo se traduce cada uno de los 5 términos musicales a estructuras de datos en Python?",
      ref: "Escala · Modo · Grado · Intervalo · Progresión en PROYECTO_FINAL_MUSICA_ESTOCASTICA.py",
      rows: [
        ["Escala y Modo", "Modo ('mayor' alegra / 'menor' entristece) es la clave del diccionario INTERVALOS (L37) que define la distribución de semitonos; Escala es la lista ordenada list[str] de 7 notas resultante en escala_actual (L64)."],
        ["Grado (1º al 7º)", "Se representa como el índice entero 0..6 dentro de escala_actual (traducido en O(1) con indice_para_la_nota_dentro_de_la_escala, L245)."],
        ["Intervalos y Progresiones", "Intervalo es el salto modular desplazamientos = {'3a': 2, '5a': 4, '7a': 6} (L361: estar a +2 notas en la escala es una 3ª); Progresión es la lista generalizada de grados progresion_folia o progresion_quintas (L240–241)."]
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

  let quizPool = [];
  let quizPos = 0;

  function shuffleIndices(len) {
    const arr = [];
    for (let i = 0; i < len; i++) arr.push(i);
    for (let i = len - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function getParanoiaQuizItems() {
    return HARDCORE_ITEMS.filter(function (it) {
      return it.cat === "defensa" || it.cat === "paranoia";
    });
  }

  function renderQuizCard() {
    const poolItems = getParanoiaQuizItems();
    if (!poolItems.length || !quizQuestionEl) return;
    if (quizPool.length !== poolItems.length) {
      quizPool = shuffleIndices(poolItems.length);
      quizPos = 0;
    }
    const item = poolItems[quizPool[quizPos]];
    if (quizCounterEl) {
      quizCounterEl.textContent = "Pregunta " + (quizPos + 1) + " / " + poolItems.length;
    }
    if (quizTagEl) {
      quizTagEl.textContent = item.tag + " · " + item.pill;
    }
    quizQuestionEl.textContent = item.title;
    if (quizRefEl) {
      quizRefEl.textContent = item.ref;
    }
    if (quizAnswerEl) {
      const snip = item.snippet ? '<pre class="hc-snippet">' + escapeHtml(item.snippet) + "</pre>" : "";
      const dl = item.rows.map(function (r) {
        return "<dt>" + escapeHtml(r[0]) + "</dt><dd>" + escapeHtml(r[1]) + "</dd>";
      }).join("");
      quizAnswerEl.innerHTML = snip + '<dl class="hc-dl">' + dl + "</dl>";
      quizAnswerEl.hidden = true;
    }
    if (btnQuizReveal) {
      btnQuizReveal.textContent = "👁 Mostrar respuesta blindada";
    }
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
      const extraCls = item.cat === "paranoia"
        ? " hc-card--paranoia"
        : (item.cat === "defensa" ? " hc-card--defensa" : "");

      return (
        '<article class="hc-card' + extraCls + '" data-hc-cat="' + item.cat + '" data-hc-search="' + escapeHtml(searchBlob) + '">' +
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

    // Mostrar conteo real en cada pestaña de categoría
    hcTabs.forEach(function (tab) {
      const cat = tab.dataset.hcTab;
      if (tab.dataset.baseLabel === undefined) {
        tab.dataset.baseLabel = tab.textContent.trim();
      }
      let count = 0;
      if (cat === "all") {
        count = HARDCORE_ITEMS.length + 3;
      } else if (cat === "simulador") {
        count = 2;
      } else {
        count = HARDCORE_ITEMS.filter(function (it) { return it.cat === cat; }).length;
      }
      tab.innerHTML = escapeHtml(tab.dataset.baseLabel) + '<span class="hc-tab__count">' + count + "</span>";
    });

    renderQuizCard();
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
    const showQuizBlock = (currentHcTab === "all" || currentHcTab === "defensa" || currentHcTab === "paranoia") && !q;
    if (hcSimPanel) hcSimPanel.hidden = !showSimBlocks;
    if (hcArchPanel) hcArchPanel.hidden = !showSimBlocks;
    if (hcQuizPanel) hcQuizPanel.hidden = !showQuizBlock;

    if (hcQuickChips) {
      hcQuickChips.querySelectorAll("[data-hc-quick]").forEach(function (chip) {
        chip.classList.toggle("is-active", q !== "" && chip.dataset.hcQuick.toLowerCase() === q);
      });
    }

    const extraBlocks = (showSimBlocks ? 2 : 0) + (showQuizBlock ? 1 : 0);
    const totalVisible = visibleCards + extraBlocks;
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

  if (hcQuickChips) {
    hcQuickChips.addEventListener("click", function (ev) {
      const chip = ev.target.closest("[data-hc-quick]");
      if (!chip) return;
      const term = chip.dataset.hcQuick;
      if (currentHcQuery.toLowerCase() === term.toLowerCase()) {
        currentHcQuery = "";
        if (hcSearch) hcSearch.value = "";
      } else {
        currentHcQuery = term;
        if (hcSearch) hcSearch.value = term;
        if (currentHcTab === "simulador") {
          currentHcTab = "all";
          hcTabs.forEach(function (t) {
            const active = t.dataset.hcTab === "all";
            t.classList.toggle("is-active", active);
            t.setAttribute("aria-selected", active ? "true" : "false");
          });
        }
      }
      applyHardcoreFilters();
    });
  }

  if (btnHcClear) {
    btnHcClear.addEventListener("click", function () {
      currentHcQuery = "";
      if (hcSearch) hcSearch.value = "";
      applyHardcoreFilters();
    });
  }

  if (btnQuizRandom) {
    btnQuizRandom.addEventListener("click", function () {
      const poolItems = getParanoiaQuizItems();
      if (!poolItems.length) return;
      quizPool = shuffleIndices(poolItems.length);
      quizPos = 0;
      renderQuizCard();
    });
  }

  if (btnQuizNext) {
    btnQuizNext.addEventListener("click", function () {
      const poolItems = getParanoiaQuizItems();
      if (!poolItems.length) return;
      quizPos = (quizPos + 1) % poolItems.length;
      renderQuizCard();
    });
  }

  if (btnQuizReveal) {
    btnQuizReveal.addEventListener("click", function () {
      if (!quizAnswerEl) return;
      const willShow = quizAnswerEl.hidden;
      quizAnswerEl.hidden = !willShow;
      btnQuizReveal.textContent = willShow ? "🙈 Ocultar respuesta" : "👁 Mostrar respuesta blindada";
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
