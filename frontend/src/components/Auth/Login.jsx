import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { BiWifi, BiEnvelope, BiLock, BiHide, BiShow } from 'react-icons/bi';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);
        
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message || "Identifiants invalides");
        }
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            {/* Éléments de décor (Blobs) */}
            <div style={styles.blob1}></div>
            <div style={styles.blob2}></div>

            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.logoContainer}>
                        <BiWifi style={styles.logo} />
                    </div>
                    <h1 style={styles.title}>Connexion</h1>
                    <p style={styles.subtitle}>Accédez à votre espace IoT AIS</p>
                </div>

                {error && <div style={styles.errorBanner}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Adresse Email</label>
                        <div style={styles.inputWrapper}>
                            <BiEnvelope style={styles.inputIcon} />
                            <input
                                type="email"
                                placeholder="votre@email.com"
                                style={styles.input}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <div style={styles.labelRow}>
                            <label style={styles.label}>Mot de passe</label>
                            <span style={styles.forgotPass}>Oublié ?</span>
                        </div>
                        <div style={styles.inputWrapper}>
                            <BiLock style={styles.inputIcon} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                style={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)} 
                                style={styles.eyeIcon}
                            >
                                {showPassword ? <BiHide /> : <BiShow />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        style={{...styles.submitBtn, opacity: loading ? 0.7 : 1}}
                    >
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>

                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        Pas encore de compte ?{' '}
                        <Link to="/register" style={styles.link}>
                            Inscrivez-vous ici
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        Width:'100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
        padding: '20px',
    },
    blob1: {
        position: 'absolute',
        width: '450px',
        height: '450px',
        background: '#dbeafe',
        borderRadius: '50%',
        filter: 'blur(80px)',
        top: '-150px',
        right: '-100px',
        zIndex: 0,
    },
    blob2: {
        position: 'absolute',
        width: '350px',
        height: '350px',
        background: '#ede9fe',
        borderRadius: '50%',
        filter: 'blur(70px)',
        bottom: '-100px',
        left: '-50px',
        zIndex: 0,
    },
    card: {
        width: '100%',
        maxWidth: '440px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        borderRadius: '28px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
        padding: '40px',
        zIndex: 1,
        border: '1px solid rgba(255, 255, 255, 0.7)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '32px',
    },
    logoContainer: {
        width: '70px',
        height: '70px',
        backgroundColor: '#2563eb',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
        boxShadow: '0 10px 20px -5px rgba(37, 99, 235, 0.4)',
    },
    logo: {
        fontSize: '35px',
        color: 'white',
    },
    title: {
        fontSize: '26px',
        fontWeight: '800',
        color: '#1e293b',
        margin: '0',
    },
    subtitle: {
        color: '#64748b',
        fontSize: '15px',
        marginTop: '10px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '22px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    labelRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#475569',
    },
    inputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    inputIcon: {
        position: 'absolute',
        left: '14px',
        color: '#94a3b8',
        fontSize: '20px',
    },
    input: {
        width: '100%',
        padding: '14px 16px 14px 45px',
        borderRadius: '14px',
        border: '1px solid #e2e8f0',
        fontSize: '15px',
        outline: 'none',
        backgroundColor: '#fff',
        boxSizing: 'border-box',
    },
    eyeIcon: {
        position: 'absolute',
        right: '14px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#94a3b8',
        fontSize: '20px',
        display: 'flex',
    },
    forgotPass: {
        fontSize: '12px',
        color: '#2563eb',
        fontWeight: '600',
        cursor: 'pointer',
    },
    errorBanner: {
        padding: '12px',
        backgroundColor: '#fef2f2',
        color: '#dc2626',
        borderRadius: '10px',
        fontSize: '13px',
        textAlign: 'center',
        border: '1px solid #fee2e2',
        marginBottom: '20px'
    },
    submitBtn: {
        backgroundColor: '#2563eb',
        color: 'white',
        padding: '16px',
        borderRadius: '14px',
        border: 'none',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
        transition: 'all 0.3s ease',
    },
    footer: {
        marginTop: '30px',
        textAlign: 'center',
        borderTop: '1px solid #f1f5f9',
        paddingTop: '20px',
    },
    footerText: {
        fontSize: '14px',
        color: '#64748b',
    },
    link: {
        color: '#2563eb',
        textDecoration: 'none',
        fontWeight: '600',
    }
};

export default Login;