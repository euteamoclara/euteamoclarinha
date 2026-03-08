
       /*Em minha defesa, já quero avisar de antemão que o GEGE me ajudou na maioria das coisas aqui. 
        Estou enferrujado! */
        
        document.addEventListener('DOMContentLoaded', () => {
            
            // iniciar o site
            const botaoEntrar = document.getElementById('botao-entrar');
            const telaInicial = document.getElementById('tela-inicial');
            const audioFundo = document.getElementById('audio-fundo');

            botaoEntrar.addEventListener('click', () => {
                
                if (audioFundo) {
                    audioFundo.volume = 0;
                    audioFundo.play().then(() => {
                        audioFundo.pause();
                        audioFundo.currentTime = 0;
                    }).catch(erro => {
                        console.log("deu erro no audio");
                    });
                }
                
                telaInicial.style.opacity = '0';
                
                setTimeout(() => {
                    telaInicial.style.display = 'none';
                }, 1500);
            });

            // estrelas
            const canvas = document.getElementById('fundo-estrelas');
            const ctx = canvas.getContext('2d');
            let larguraTela;
            let alturaTela;
            let estrelas = [];
            let estrelasCadentes = [];

            function arrumarTamanhoDaTela() {
                larguraTela = window.innerWidth;
                alturaTela = window.innerHeight;
                canvas.width = larguraTela;
                canvas.height = alturaTela;
                
                criarEstrelas();
            }

            class Estrela {
                constructor() {
                    this.x = Math.random() * larguraTela;
                    this.y = Math.random() * alturaTela;
                    this.raio = Math.random() * 1.5;
                    this.transparencia = Math.random();
                    this.velocidadePiscar = (Math.random() * 0.01) + 0.005; 
                    
                    if (Math.random() > 0.5) {
                        this.direcaoPiscar = 1;
                    } else {
                        this.direcaoPiscar = -1;
                    }
                }
                
                desenhar() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.raio, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${this.transparencia})`;
                    ctx.fill();
                }
                
                atualizar() {
                    this.transparencia += this.velocidadePiscar * this.direcaoPiscar;
                    
                    if (this.transparencia >= 1) {
                        this.transparencia = 1;
                        this.direcaoPiscar = -1;
                    } else if (this.transparencia <= 0.1) {
                        this.transparencia = 0.1;
                        this.direcaoPiscar = 1;
                    }
                    
                    this.desenhar();
                }
            }

            class EstrelaCadente {
                constructor() { 
                    this.reiniciar(); 
                }
                
                reiniciar() {
                    this.x = Math.random() * larguraTela;
                    this.y = Math.random() * (alturaTela / 2);
                    this.tamanho = (Math.random() * 150) + 50; 
                    this.velocidade = (Math.random() * 6) + 3;
                    this.angulo = (Math.PI / 4) + (Math.random() * 0.2);
                    this.transparencia = 0;
                    this.estado = 'aparecendo';
                    this.tempoEspera = Math.random() * 150;
                }
                
                desenhar() {
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    
                    let fimX = this.x - Math.cos(this.angulo) * this.tamanho;
                    let fimY = this.y - Math.sin(this.angulo) * this.tamanho;
                    
                    ctx.lineTo(fimX, fimY);
                    
                    let cores = ctx.createLinearGradient(this.x, this.y, fimX, fimY);
                    cores.addColorStop(0, `rgba(255, 255, 255, ${this.transparencia})`);
                    cores.addColorStop(1, `rgba(255, 255, 255, 0)`);
                    
                    ctx.strokeStyle = cores;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
                
                atualizar() {
                    if (this.tempoEspera > 0) { 
                        this.tempoEspera--; 
                        return; 
                    }
                    
                    this.x += Math.cos(this.angulo) * this.velocidade;
                    this.y += Math.sin(this.angulo) * this.velocidade;

                    if (this.estado === 'aparecendo') {
                        this.transparencia += 0.05;
                        
                        if (this.transparencia >= 1) {
                            this.estado = 'sumindo';
                        }
                    } else {
                        this.transparencia -= 0.02;
                        
                        if (this.transparencia <= 0) {
                            this.reiniciar();
                        }
                    }
                    
                    this.desenhar();
                }
            }

            function criarEstrelas() {
                estrelas = [];
                let quantidade = Math.floor((larguraTela * alturaTela) / 2000);
                
                for (let i = 0; i < quantidade; i++) { 
                    let novaEstrela = new Estrela();
                    estrelas.push(novaEstrela); 
                }
                
                estrelasCadentes = [];
                for (let i = 0; i < 5; i++) { 
                    let novaCadente = new EstrelaCadente();
                    estrelasCadentes.push(novaCadente); 
                }
            }

            function animarEstrelas() {
                ctx.clearRect(0, 0, larguraTela, alturaTela);
                
                estrelas.forEach(estrela => {
                    estrela.atualizar();
                });
                
                estrelasCadentes.forEach(cadente => {
                    cadente.atualizar();
                });
                
                requestAnimationFrame(animarEstrelas);
            }

            window.addEventListener('resize', arrumarTamanhoDaTela);
            arrumarTamanhoDaTela();
            animarEstrelas();

            // musica
            function tocarMusica() {
                if (audioFundo) {
                    audioFundo.volume = 0;
                    
                    audioFundo.play().catch(erro => {
                        console.log("erro na musica: ", erro);
                    });
                    
                    let aumentarSom = setInterval(() => {
                        if (audioFundo.volume < 0.4) {
                            let novoVolume = audioFundo.volume + 0.02;
                            if (novoVolume > 0.4) novoVolume = 0.4;
                            audioFundo.volume = novoVolume;
                        } else {
                            clearInterval(aumentarSom);
                        }
                    }, 250);
                }
            }

            // jogo
            const PALAVRA_CERTA = "OLHOS";
            const TOTAL_LINHAS = 6;
            const TOTAL_COLUNAS = 5;
            
            const dicas = {
                "PEITO": "Seus seios são lindos, mas algo me prende também...",
                "CORPO": "Seu corpo é delirante, mas também não é isso...",
                "ROSTO": "Sou encantado na sua beleza, quase lá...",
                "JEITO": "Seu jeitinho me apaixona, só que não é isso...",
                "MENTE": "Sua mente é incrível, você é muito inteligente mas ainda não é isso."
            };
            
            let tentativas = [];
            for (let i = 0; i < TOTAL_LINHAS; i++) {
                let linhaVazia = ["", "", "", "", ""];
                tentativas.push(linhaVazia);
            }
            
            let linhaAtual = 0;
            let colunaAtual = 0;
            let jogoAcabou = false;
            let animando = false;

            const tabuleiro = document.getElementById('tabuleiro');
            const botoesTeclado = document.querySelectorAll('.tecla');

            function montarTabuleiro() {
                for (let r = 0; r < TOTAL_LINHAS; r++) {
                    const divLinha = document.createElement('div');
                    divLinha.className = 'linha-tabuleiro';
                    
                    for (let c = 0; c < TOTAL_COLUNAS; c++) {
                        const quadrado = document.createElement('div');
                        quadrado.className = 'quadrado';
                        quadrado.id = `quadrado-${r}-${c}`;
                        divLinha.appendChild(quadrado);
                    }
                    
                    tabuleiro.appendChild(divLinha);
                }
            }

            function mostrarAviso(mensagem, tempo = 2000) {
                const aviso = document.createElement('div');
                aviso.className = 'notificacao';
                aviso.textContent = mensagem;
                
                const caixaDeAvisos = document.getElementById('container-notificacao');
                caixaDeAvisos.appendChild(aviso);
                
                setTimeout(() => {
                    aviso.style.opacity = '0';
                    setTimeout(() => {
                        aviso.remove();
                    }, 500);
                }, tempo);
            }

            function atualizarTelaDoJogo() {
                for (let r = 0; r < TOTAL_LINHAS; r++) {
                    for (let c = 0; c < TOTAL_COLUNAS; c++) {
                        const quadrado = document.getElementById(`quadrado-${r}-${c}`);
                        const letra = tentativas[r][c];
                        
                        if (r === linhaAtual) {
                            if (letra !== "") {
                                if (quadrado.textContent !== letra) {
                                    quadrado.textContent = letra;
                                    quadrado.setAttribute('data-estado', 'preenchido');
                                }
                            } else {
                                quadrado.textContent = "";
                                quadrado.removeAttribute('data-estado');
                            }
                        }
                    }
                }
            }

            function adicionarLetra(letra) {
                if (colunaAtual < TOTAL_COLUNAS) {
                    if (!jogoAcabou) {
                        if (!animando) {
                            tentativas[linhaAtual][colunaAtual] = letra.toUpperCase();
                            colunaAtual++;
                            atualizarTelaDoJogo();
                        }
                    }
                }
            }

            function apagarLetra() {
                if (colunaAtual > 0) {
                    if (!jogoAcabou) {
                        if (!animando) {
                            colunaAtual--;
                            tentativas[linhaAtual][colunaAtual] = "";
                            atualizarTelaDoJogo();
                        }
                    }
                }
            }

            function colorirTecla(letra, novoEstado) {
                const tecla = document.querySelector(`.tecla[data-tecla="${letra.toLowerCase()}"]`);
                
                if (!tecla) {
                    return;
                }
                
                const estadoAtual = tecla.getAttribute('data-estado');
                
                if (estadoAtual === 'certo') {
                    return;
                }
                
                if (estadoAtual === 'quase') {
                    if (novoEstado !== 'certo') {
                        return;
                    }
                }
                
                tecla.setAttribute('data-estado', novoEstado);
            }

            async function enviarPalavra() {
                if (colunaAtual !== TOTAL_COLUNAS) {
                    return;
                }
                if (jogoAcabou) {
                    return;
                }
                if (animando) {
                    return;
                }

                const palavraDigitada = tentativas[linhaAtual].join("");
                
                animando = true;
                
                let letrasCertas = PALAVRA_CERTA.split("");
                let letrasDigitadas = palavraDigitada.split("");
                let estadoDosQuadrados = ["errado", "errado", "errado", "errado", "errado"];

                // primeiro ve se acertou no lugar certo
                for (let i = 0; i < TOTAL_COLUNAS; i++) {
                    if (letrasDigitadas[i] === letrasCertas[i]) {
                        estadoDosQuadrados[i] = "certo";
                        letrasCertas[i] = null;
                    }
                }

                // depois ve se a letra existe mas ta no lugar errado
                for (let i = 0; i < TOTAL_COLUNAS; i++) {
                    if (estadoDosQuadrados[i] === "certo") {
                        continue;
                    }
                    
                    let posicao = letrasCertas.indexOf(letrasDigitadas[i]);
                    
                    if (posicao !== -1) {
                        estadoDosQuadrados[i] = "quase";
                        letrasCertas[posicao] = null;
                    }
                }

                // anima os quadradinhos girando
                for (let i = 0; i < TOTAL_COLUNAS; i++) {
                    const quadrado = document.getElementById(`quadrado-${linhaAtual}-${i}`);
                    const letra = letrasDigitadas[i];
                    
                    quadrado.classList.add('girar-sair');
                    
                    await new Promise(esperar => {
                        setTimeout(esperar, 250);
                    });
                    
                    quadrado.setAttribute('data-estado', estadoDosQuadrados[i]);
                    colorirTecla(letra, estadoDosQuadrados[i]);
                    
                    quadrado.classList.remove('girar-sair');
                    quadrado.classList.add('girar-entrar');
                    
                    await new Promise(esperar => {
                        setTimeout(esperar, 250);
                    });
                    
                    quadrado.classList.remove('girar-entrar');
                }

                if (palavraDigitada === PALAVRA_CERTA) {
                    jogoAcabou = true;
                    finalDoJogo();
                } else {
                    if (linhaAtual === TOTAL_LINHAS - 1) {
                        jogoAcabou = true;
                        mostrarAviso("A resposta estava nos seus " + PALAVRA_CERTA, 3000);
                        
                        setTimeout(() => {
                            finalDoJogo();
                        }, 3000); 
                    } else {
                        if (dicas[palavraDigitada]) {
                            mostrarAviso(dicas[palavraDigitada], 4000);
                        }

                        linhaAtual++;
                        colunaAtual = 0;
                        animando = false;
                    }
                }
            }

            // escutar o teclado fisico do celular ou pc
            document.addEventListener('keydown', (evento) => {
                if (jogoAcabou) {
                    return;
                }
                if (animando) {
                    return;
                }
                
                const botaoPressionado = evento.key.toLowerCase();
                
                if (botaoPressionado === 'enter') {
                    if (colunaAtual < TOTAL_COLUNAS) { 
                        mostrarAviso("Palavra muito curta"); 
                    } else { 
                        enviarPalavra(); 
                    }
                } else if (botaoPressionado === 'backspace') {
                    apagarLetra();
                } else {
                    // testa se eh uma letra do alfabeto
                    if (/^[a-z]$/.test(botaoPressionado)) {
                        adicionarLetra(botaoPressionado);
                    }
                }
            });

            // escutar cliques nos botoes da tela
            botoesTeclado.forEach(botao => {
                botao.addEventListener('click', () => {
                    if (jogoAcabou) {
                        return;
                    }
                    if (animando) {
                        return;
                    }
                    
                    const botaoPressionado = botao.getAttribute('data-tecla');
                    
                    if (botaoPressionado === 'enter') {
                        if (colunaAtual < TOTAL_COLUNAS) { 
                            mostrarAviso("Palavra muito curta"); 
                        } else { 
                            enviarPalavra(); 
                        }
                    } else if (botaoPressionado === 'backspace') {
                        apagarLetra();
                    } else {
                        adicionarLetra(botaoPressionado);
                    }
                });
            });

            // final
            async function finalDoJogo() {
                animando = true;
                tocarMusica();

                // anima as letras piscando
                for (let i = 0; i < TOTAL_COLUNAS; i++) {
                    const quadrado = document.getElementById(`quadrado-${linhaAtual}-${i}`);
                    
                    setTimeout(() => {
                        quadrado.classList.add('brilho-vitoria');
                    }, i * 200);
                }

                await new Promise(esperar => {
                    setTimeout(esperar, 3000);
                });

                // faz a tela escurecer devagar
                const telaEscura = document.getElementById('tela-escura');
                telaEscura.style.transitionDuration = '5s';
                telaEscura.style.opacity = '1';
                
                await new Promise(esperar => {
                    setTimeout(esperar, 5000);
                });

                // esconde o jogo e mostra a carta final
                document.getElementById('container-jogo').style.display = 'none';
                document.getElementById('container-final').style.display = 'flex';
                document.body.classList.add('permitir-rolagem'); 

                // clareia de novo para ver a mensagem
                telaEscura.style.transitionDuration = '8s';
                telaEscura.style.opacity = '0';
            }

            // comeca o jogo montando os quadradinhos vazios
            montarTabuleiro();
        });
