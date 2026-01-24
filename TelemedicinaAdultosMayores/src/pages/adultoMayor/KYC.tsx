import React, { useState, useEffect } from "react";
import "../../styles/animo.css";

type KycData = {
  id?: string;
  cedula: string;
  fechaNacimiento: string;
  verificado: boolean;
  motivoVerificacion?: string;
  creadoEn: string;
};

const KYC: React.FC = () => {
  const [cedula, setCedula] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [resultado, setResultado] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [guardado, setGuardado] = useState<boolean>(false);

  useEffect(() => {
    setGuardado(false);
  }, []);

  const validarFormatoCedula = (c: string) => {
    // Validación simple: solo dígitos y entre 6-12 caracteres
    return /^\d{6,12}$/.test(c);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResultado(null);

    if (!validarFormatoCedula(cedula)) {
      setError("Número de cédula inválido (solo dígitos, 6-12 caracteres)");
      return;
    }
    if (!fechaNacimiento) {
      setError("Ingrese la fecha de nacimiento");
      return;
    }

    // Verificación básica: comparar con perfil si existe en localStorage
    const userProfileRaw = localStorage.getItem("usuario_perfil");
    let match = false;
    let motivo = "No se encontró perfil para comparar";

    if (userProfileRaw) {
      try {
        const perfil = JSON.parse(userProfileRaw) as any;
        // campos esperados: cedula, fecha_nacimiento (ISO or yyyy-mm-dd)
        const perfilCed = String(perfil.cedula || perfil.cedula_id || "");
        const perfilFN = (perfil.fecha_nacimiento || perfil.fechaNacimiento || "").split("T")[0];
        const providedFN = fechaNacimiento;
        if (perfilCed && perfilFN) {
          const cedMatch = perfilCed === cedula;
          const fnMatch = perfilFN === providedFN;
          match = cedMatch && fnMatch;
          motivo = `Comparación: cédula ${cedMatch ? "coincide" : "no coincide"}, fechaNacimiento ${fnMatch ? "coincide" : "no coincide"}`;
        } else {
          motivo = "Perfil incompleto para verificación";
        }
      } catch (err) {
        motivo = "Error leyendo perfil local";
      }
    }

    const verificado = match;
    setResultado(verificado ? "Verificado: los datos coinciden" : `No verificado: ${motivo}`);

    // Guardar resultado en localStorage por usuario
    try {
      const userId = localStorage.getItem("userId") || "anon";
      const key = `kyc_${userId}`;
      const raw = localStorage.getItem(key);
      const lista: KycData[] = raw ? JSON.parse(raw) : [];
      const nuevo: KycData = {
        id: Date.now().toString(),
        cedula,
        fechaNacimiento,
        verificado,
        motivoVerificacion: verificado ? "Coinciden los datos" : motivo,
        creadoEn: new Date().toISOString(),
      };
      const nuevos = [nuevo, ...lista];
      localStorage.setItem(key, JSON.stringify(nuevos));
      setGuardado(true);
    } catch (err: any) {
      setError("Error guardando verificación en localStorage");
    }
  };

  return (
    <div className="home-container">
      <h2>Formulario de Verificación de Identidad (KYC Básico)</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <label>Número de cédula</label>
            <input value={cedula} onChange={(e) => setCedula(e.target.value)} placeholder="Ej: 12345678" />
          </div>

          <div>
            <label>Fecha de nacimiento</label>
            <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} />
          </div>

          <div>
            <button className="btn-primary" type="submit">Verificar</button>
          </div>
        </div>
      </form>

      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
      {resultado && <p style={{ color: resultado.startsWith("Verificado") ? "#065f46" : "#b91c1c" }}>{resultado}</p>}
      {guardado && <p style={{ color: "#0f172a" }}>Resultado guardado en localStorage.</p>}

      <h3>Historial de verificaciones</h3>
      <KycList />
    </div>
  );
};

const KycList: React.FC = () => {
  const [lista, setLista] = useState<KycData[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId") || "anon";
    const key = `kyc_${userId}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        setLista(JSON.parse(raw));
      } catch (_) {
        setLista([]);
      }
    } else setLista([]);
  }, []);

  if (lista.length === 0) return <p>No hay verificaciones registradas.</p>;

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="historial-table" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Cédula</th>
            <th>Fecha Nac.</th>
            <th>Verificado</th>
            <th>Motivo</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((l) => (
            <tr key={l.id}>
              <td>{new Date(l.creadoEn).toLocaleString()}</td>
              <td>{l.cedula}</td>
              <td>{l.fechaNacimiento}</td>
              <td>{l.verificado ? "Sí" : "No"}</td>
              <td>{l.motivoVerificacion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KYC;
