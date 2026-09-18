import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import "./style.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const categorias = [
  "TODOS",
  "🍳 COZINHA",
  "🚿 BANHEIRO",
  "🧹 LIMPEZA",
  "🧺 LAVANDERIA",
  "🔌 BÁSICOS",
];

const icones = {
  "Panela de arroz elétrica": "🍚",
  "Panela de pressão elétrica": "🍲",
  "Frigideira elétrica": "🍳",
  Geladeira: "🧊",
  "Kit com 2 pratos": "🍽️",
  "Kit com 2 copos": "🥛",
  "Kit com 2 xícaras": "☕",
  "Kit com 2 garfos": "🍴",
  "Kit com 2 facas": "🔪",
  "Kit com 2 colheres": "🥄",
  "Kit com 2 colheres de sobremesa": "🥄",
  "Faca de cozinha": "🔪",
  "Tábua de cortar": "🪵",
  "Colher grande": "🥄",
  Concha: "🥄",
  Espátula: "🍴",
  "Kit com 2 a 4 potes com tampa": "🥣",
  "Escorredor de louça": "🍽️",
  "Escorredor de macarrão": "🍝",
  "Kit com 2 panos de prato": "🧺",
  "Coador de café": "☕",
  "Filtros de café": "☕",
  "Garrafa térmica": "🫖",
  "Kit com 2 toalhas de banho": "🛁",
  "Kit com 2 toalhas de rosto": "🧴",
  "Tapete de banheiro": "🛁",
  Lixeira: "🗑️",
  "Escova sanitária": "🧹",
  "Vassoura + cabo": "🧹",
  "Rodo + cabo": "🧹",
  Pá: "🧹",
  Balde: "🪣",
  "Kit com 2 panos de chão": "🧽",
  "Kit com 2 panos de limpeza": "🧽",
  "Escova de limpeza": "🧽",
  "Rodo de pia": "🧽",
  Esponja: "🧽",
  Varal: "🧺",
  Pregadores: "📎",
  "Cesto para roupa suja": "🧺",
  "Extensão / filtro de linha": "🔌",
  Adaptadores: "🔌",
  Lâmpadas: "💡",
};

function App() {
  const [presentes, setPresentes] = useState([]);
  const [categoria, setCategoria] = useState("TODOS");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [presenteSelecionado, setPresenteSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const [fridgeModal, setFridgeModal] = useState(false);
  const [fridgeMode, setFridgeMode] = useState(null);
  const [fridgeValue, setFridgeValue] = useState("");

  useEffect(() => {
    carregarPresentes();
  }, []);

  async function carregarPresentes() {
    setCarregando(true);
    setErro("");

    if (!supabase) {
      setErro(
        "O site ainda precisa das chaves do Supabase nas variáveis de ambiente."
      );
      setCarregando(false);
      return;
    }

    const { data, error } = await supabase.rpc("lista_publica_presentes");

    if (error) {
      setErro(error.message);
    } else {
      setPresentes(data || []);
    }

    setCarregando(false);
  }

  const presentesFiltrados = useMemo(() => {
    if (categoria === "TODOS") return presentes;

    const mapa = {
      "🍳 COZINHA": "cozinha",
      "🚿 BANHEIRO": "banheiro",
      "🧹 LIMPEZA": "limpeza",
      "🧺 LAVANDERIA": "lavanderia",
      "🔌 BÁSICOS": "básicos",
    };

    return presentes.filter(
      (p) => p.categoria?.toLowerCase() === mapa[categoria]
    );
  }, [presentes, categoria]);

  function abrirPresente(presente) {
    setPresenteSelecionado(presente);
    setNome("");
    setMensagem("");
    setQuantidade(1);
    setSucesso(false);

    if (presente.nome === "Geladeira") {
      setFridgeModal(true);
      setFridgeMode(null);
      setFridgeValue("");
    } else {
      setModalAberto(true);
    }
  }

  function fecharModal() {
    if (enviando) return;

    setModalAberto(false);
    setPresenteSelecionado(null);
    setSucesso(false);
  }

  async function reservar() {
    if (!nome.trim()) {
      alert("Digite seu nome. 🤍");
      return;
    }

    setEnviando(true);

    const { error } = await supabase.rpc("reservar_presente", {
      p_presente_id: presenteSelecionado.id,
      p_nome: nome.trim(),
      p_mensagem: mensagem.trim() || null,
      p_quantidade: quantidade,
    });

    if (error) {
      alert(error.message);
      setEnviando(false);
      await carregarPresentes();
      return;
    }

    setSucesso(true);
    setEnviando(false);
    await carregarPresentes();
  }

  async function darGeladeiraInteira() {
    if (!nome.trim()) {
      alert("Digite seu nome. 🤍");
      return;
    }

    setEnviando(true);

    const { error } = await supabase.rpc("dar_geladeira_inteira", {
      p_nome: nome.trim(),
      p_mensagem: mensagem.trim() || null,
    });

    if (error) {
      alert(error.message);
      setEnviando(false);
      await carregarPresentes();
      return;
    }

    setSucesso(true);
    setEnviando(false);
    await carregarPresentes();
  }

  async function contribuirGeladeira() {
    if (!nome.trim()) {
      alert("Digite seu nome. 🤍");
      return;
    }

    const valor = Number(fridgeValue.replace(",", "."));

    if (!valor || valor <= 0) {
      alert("Digite um valor válido. 🤍");
      return;
    }

    setEnviando(true);

    const { error } = await supabase.rpc("contribuir_geladeira", {
      p_nome: nome.trim(),
      p_valor: valor,
      p_mensagem: mensagem.trim() || null,
    });

    if (error) {
      alert(error.message);
      setEnviando(false);
      await carregarPresentes();
      return;
    }

    setSucesso(true);
    setEnviando(false);
    await carregarPresentes();
  }

  async function compartilhar() {
    const texto =
      "🏠🤍 Enxoval da primeira casinha da Maria & Nicaio!\n\nUm pedacinho da nossa primeira casinha começa com você.";

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Enxoval da primeira casinha da Maria & Nicaio",
          text: texto,
          url: window.location.href,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copiado! 🤍");
    }
  }

  function quantidadeRestante(presente) {
    return Math.max(
      0,
      Number(presente.quantidade_necessaria || 1) -
        Number(presente.quantidade_reservada || 0)
    );
  }

  function estaCompleto(presente) {
    return quantidadeRestante(presente) <= 0;
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="house">🏠🤍</div>

        <h1>ENXOVAL DA PRIMEIRA CASINHA DA MARIA & NICАIO</h1>

        <div className="subtitle">
          Um pedacinho da nossa primeira casinha começa com você.
        </div>

        <p className="hero-text">
          Nossa primeira casinha está começando!
          <br />
          <br />
          Depois de tantos sonhos, planos e momentos juntos, chegou a hora de
          começarmos uma nova fase: construir o nosso cantinho.
          <br />
          <br />
          Criamos essa lista com alguns dos itens que vão fazer parte da nossa
          primeira casa.
          <br />
          <br />
          Se quiser fazer parte desse momento, escolha um presente da lista.
          Assim que você confirmar, ele ficará reservado para você e deixará de
          aparecer como disponível para os outros convidados.
          <br />
          <br />
          Mais do que qualquer presente, ter você fazendo parte desse momento
          significa muito para nós. 🤍
        </p>

        <button
          className="primary-button"
          onClick={() =>
            document
              .getElementById("lista")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          🎁 VER NOSSA LISTA
        </button>

        <button
          className="card-button"
          style={{ maxWidth: 260, margin: "12px auto 0" }}
          onClick={compartilhar}
        >
          🤍 COMPARTILHAR LISTA
        </button>
      </header>

      <main className="container" id="lista">
        <div className="categories">
          {categorias.map((item) => (
            <button
              key={item}
              className={`category-button ${
                categoria === item ? "active" : ""
              }`}
              onClick={() => setCategoria(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <h2 className="section-title">🎁 Nossa lista</h2>

        {carregando && (
          <p style={{ textAlign: "center", padding: 40 }}>
            Carregando nossa listinha... 🤍
          </p>
        )}

        {erro && (
          <div
            style={{
              margin: "20px 0",
              padding: 18,
              borderRadius: 15,
              background: "#fff0f0",
              color: "#8b4d4d",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <strong>Ops! </strong>
            {erro}
          </div>
        )}

        {!carregando && !erro && (
          <div className="gifts">
            {presentesFiltrados.map((presente) => {
              const restante = quantidadeRestante(presente);
              const completo = estaCompleto(presente);
              const reservado = Number(presente.quantidade_reservada || 0);

              return (
                <article className="card" key={presente.id}>
                  <div className="card-image">
                    {presente.imagem_url ? (
                      <img
                        src={presente.imagem_url}
                        alt={presente.nome}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      icones[presente.nome] || "🎁"
                    )}
                  </div>

                  <div className="card-content">
                    <div className="card-category">
                      {presente.categoria}
                    </div>

                    <h3>{presente.nome}</h3>

                    <p>{presente.descricao}</p>

                    {presente.valor_aproximado && (
                      <div className="price">
                        Valor aproximado: R${" "}
                        {Number(presente.valor_aproximado).toFixed(2)}
                      </div>
                    )}

                    {presente.tipo !== "especial" && (
                      <div className="status">
                        {completo
                          ? "✅ ITEM COMPLETO"
                          : `🤍 ${reservado} de ${presente.quantidade_necessaria} garantido(s) • ${restante} restante(s)`}
                      </div>
                    )}

                    {presente.nome === "Geladeira" ? (
                      <button
                        className="card-button"
                        onClick={() => abrirPresente(presente)}
                        disabled={completo}
                      >
                        {completo
                          ? "✅ GELADEIRA GARANTIDA"
                          : "🧊 PARTICIPAR DA GELADEIRA"}
                      </button>
                    ) : (
                      <button
                        className="card-button"
                        onClick={() => abrirPresente(presente)}
                        disabled={completo}
                      >
                        {completo ? "✅ ITEM COMPLETO" : "🎁 ESCOLHER PRESENTE"}
                      </button>
                    )}

                    {presente.link_compra && (
                      <a
                        href={presente.link_compra}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "block",
                          marginTop: 10,
                          textAlign: "center",
                          color: "#876678",
                          fontFamily: "Arial, sans-serif",
                          fontSize: 13,
                        }}
                      >
                        🛍️ ONDE COMPRAR
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <section className="fridge">
          <div className="fridge-icon">🧊</div>
          <h2>Um dos maiores sonhos para a nossa primeira casinha. 🤍</h2>

          {(() => {
            const geladeira = presentes.find(
              (p) => p.nome === "Geladeira"
            );

            if (!geladeira) return null;

            const meta = Number(geladeira.meta || 3000);
            const total = Number(geladeira.total_contribuicoes || 0);
            const percentual = Math.min(100, (total / meta) * 100);

            return (
              <>
                <div className="progress">
                  <div
                    className="progress-bar"
                    style={{ width: `${percentual}%` }}
                  />
                </div>

                <div className="fridge-value">
                  R$ {total.toFixed(2)} de R$ {meta.toFixed(2)} arrecadados
                </div>
              </>
            );
          })()}
        </section>
      </main>

      <footer className="footer">
        <h2>Obrigado por fazer parte do começo da nossa história. 🤍</h2>

        <p>
          Cada item escolhido vai ganhar um espaço na nossa primeira casinha
          e, principalmente, vai carregar um pedacinho do carinho de quem nos
          presenteou.
        </p>

        <p>
          Estamos muito felizes por viver essa nova fase e ter você fazendo
          parte dela.
        </p>

        <p>
          Com carinho,
          <br />
          <strong>Maria & Nicaio 🏠🤍</strong>
        </p>
      </footer>

      {modalAberto && presenteSelecionado && (
        <div className="modal-backdrop">
          <div className="modal">
            {!sucesso ? (
              <>
                <h2>
                  Esse presente vai fazer parte da nossa primeira casinha! 🤍
                </h2>

                <p>
                  Você escolheu: <strong>{presenteSelecionado.nome}</strong>
                </p>

                {presenteSelecionado.quantidade_necessaria > 1 && (
                  <div className="field">
                    <label>QUANTIDADE</label>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 18,
                      }}
                    >
                      <button
                        className="cancel-button"
                        onClick={() =>
                          setQuantidade((q) => Math.max(1, q - 1))
                        }
                      >
                        −
                      </button>

                      <strong style={{ fontSize: 20 }}>{quantidade}</strong>

                      <button
                        className="cancel-button"
                        onClick={() =>
                          setQuantidade((q) =>
                            Math.min(
                              quantidadeRestante(presenteSelecionado),
                              q + 1
                            )
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                <div className="field">
                  <label>SEU NOME *</label>
                  <input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Digite seu nome"
                  />
                </div>

                <div className="field">
                  <label>DEIXE UMA MENSAGEM (OPCIONAL)</label>
                  <textarea
                    value={mensagem}
