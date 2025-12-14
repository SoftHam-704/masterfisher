import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1 bg-gray-50">
                <div className="container mx-auto px-4 py-12 max-w-4xl">
                    <h1 className="font-display text-4xl font-bold text-ocean-deep mb-4">
                        Política de Privacidade
                    </h1>
                    <p className="text-sm text-gray-600 mb-8">
                        Última atualização: {new Date().toLocaleDateString('pt-BR')}
                    </p>

                    <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
                        {/* Introdução */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">1. Introdução</h2>
                            <p className="text-gray-700 leading-relaxed">
                                O MasterFisher respeita sua privacidade e está comprometido em proteger seus dados pessoais.
                                Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos suas informações
                                em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
                            </p>
                        </section>

                        {/* Responsável */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">2. Responsável pelo Tratamento de Dados</h2>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700">
                                    <strong>Razão Social:</strong> MasterFisher<br />
                                    <strong>E-mail:</strong> <a href="mailto:privacidade@masterfisher.com.br" className="text-turquoise hover:underline">privacidade@masterfisher.com.br</a><br />
                                    <strong>Encarregado de Dados (DPO):</strong> Disponível mediante solicitação
                                </p>
                            </div>
                        </section>

                        {/* Dados Coletados */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">3. Dados Pessoais Coletados</h2>
                            <div className="space-y-4 text-gray-700">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">3.1. Dados fornecidos por você:</h3>
                                    <ul className="list-disc list-inside ml-4 space-y-1">
                                        <li>Nome completo</li>
                                        <li>E-mail</li>
                                        <li>Telefone/WhatsApp</li>
                                        <li>Cidade e estado</li>
                                        <li>Foto de perfil (opcional)</li>
                                        <li>Informações profissionais (para guias): especialidades, experiência, equipamentos</li>
                                        <li>Informações de pagamento (processadas pelo Mercado Pago)</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg mb-2">3.2. Dados coletados automaticamente:</h3>
                                    <ul className="list-disc list-inside ml-4 space-y-1">
                                        <li>Endereço IP</li>
                                        <li>Tipo de navegador e dispositivo</li>
                                        <li>Páginas visitadas e tempo de permanência</li>
                                        <li>Data e hora de acesso</li>
                                        <li>Cookies e tecnologias similares</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg mb-2">3.3. Dados de terceiros:</h3>
                                    <ul className="list-disc list-inside ml-4 space-y-1">
                                        <li>Informações de login via Google (nome, e-mail, foto)</li>
                                        <li>Dados de transações do Mercado Pago</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Finalidades */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">4. Finalidades do Tratamento de Dados</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>Utilizamos seus dados pessoais para:</p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li><strong>Prestação de serviços:</strong> Criar e gerenciar sua conta, conectar guias e turistas</li>
                                    <li><strong>Comunicação:</strong> Enviar notificações, atualizações e responder suas solicitações</li>
                                    <li><strong>Pagamentos:</strong> Processar pagamentos de taxas anuais dos guias</li>
                                    <li><strong>Melhorias:</strong> Analisar o uso da plataforma para melhorar nossos serviços</li>
                                    <li><strong>Segurança:</strong> Prevenir fraudes e proteger a plataforma</li>
                                    <li><strong>Cumprimento legal:</strong> Atender obrigações legais e regulatórias</li>
                                    <li><strong>Marketing:</strong> Enviar ofertas e novidades (com seu consentimento)</li>
                                </ul>
                            </div>
                        </section>

                        {/* Base Legal */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">5. Base Legal para o Tratamento</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>O tratamento de seus dados pessoais é fundamentado em:</p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li><strong>Execução de contrato:</strong> Para fornecer os serviços solicitados</li>
                                    <li><strong>Consentimento:</strong> Para envio de comunicações de marketing</li>
                                    <li><strong>Legítimo interesse:</strong> Para melhorar nossos serviços e segurança</li>
                                    <li><strong>Obrigação legal:</strong> Para cumprir requisitos legais e regulatórios</li>
                                </ul>
                            </div>
                        </section>

                        {/* Compartilhamento */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">6. Compartilhamento de Dados</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>Seus dados podem ser compartilhados com:</p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li><strong>Outros usuários:</strong> Informações de perfil público (nome, foto, cidade, especialidades)</li>
                                    <li><strong>Processadores de pagamento:</strong> Mercado Pago (para processar pagamentos)</li>
                                    <li><strong>Provedores de serviços:</strong> Hospedagem (Vercel), banco de dados (Supabase), autenticação (Google)</li>
                                    <li><strong>Autoridades:</strong> Quando exigido por lei ou ordem judicial</li>
                                </ul>
                                <p className="mt-3 font-semibold">
                                    Não vendemos seus dados pessoais a terceiros.
                                </p>
                            </div>
                        </section>

                        {/* Armazenamento */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">7. Armazenamento e Segurança</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>
                                    <strong>7.1. Localização:</strong> Seus dados são armazenados em servidores seguros localizados no Brasil
                                    e/ou em países com nível adequado de proteção de dados.
                                </p>
                                <p>
                                    <strong>7.2. Prazo de retenção:</strong> Mantemos seus dados pelo tempo necessário para cumprir as finalidades
                                    descritas ou conforme exigido por lei. Após o encerramento da conta, dados podem ser mantidos por até 5 anos
                                    para fins legais.
                                </p>
                                <p>
                                    <strong>7.3. Medidas de segurança:</strong>
                                </p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Criptografia de dados em trânsito (HTTPS/SSL)</li>
                                    <li>Criptografia de senhas</li>
                                    <li>Controles de acesso restrito</li>
                                    <li>Monitoramento de segurança</li>
                                    <li>Backups regulares</li>
                                </ul>
                            </div>
                        </section>

                        {/* Direitos do Titular */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">8. Seus Direitos (LGPD)</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>Você tem direito a:</p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li><strong>Confirmação e acesso:</strong> Saber se tratamos seus dados e acessá-los</li>
                                    <li><strong>Correção:</strong> Corrigir dados incompletos, inexatos ou desatualizados</li>
                                    <li><strong>Anonimização, bloqueio ou eliminação:</strong> De dados desnecessários ou tratados em desconformidade</li>
                                    <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                                    <li><strong>Eliminação:</strong> Excluir dados tratados com base em consentimento</li>
                                    <li><strong>Informação:</strong> Sobre compartilhamento de dados com terceiros</li>
                                    <li><strong>Revogação do consentimento:</strong> Retirar consentimento a qualquer momento</li>
                                    <li><strong>Oposição:</strong> Opor-se ao tratamento em determinadas situações</li>
                                </ul>
                                <p className="mt-4">
                                    Para exercer seus direitos, entre em contato através de:{" "}
                                    <a href="mailto:privacidade@masterfisher.com.br" className="text-turquoise hover:underline font-semibold">
                                        privacidade@masterfisher.com.br
                                    </a>
                                </p>
                            </div>
                        </section>

                        {/* Cookies */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">9. Cookies e Tecnologias Similares</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>
                                    Utilizamos cookies e tecnologias similares para melhorar sua experiência. Cookies são pequenos arquivos
                                    armazenados em seu dispositivo.
                                </p>
                                <div>
                                    <h3 className="font-semibold mb-2">Tipos de cookies utilizados:</h3>
                                    <ul className="list-disc list-inside ml-4 space-y-1">
                                        <li><strong>Essenciais:</strong> Necessários para o funcionamento da plataforma</li>
                                        <li><strong>Funcionais:</strong> Lembram suas preferências</li>
                                        <li><strong>Analíticos:</strong> Ajudam a entender como você usa a plataforma</li>
                                        <li><strong>Marketing:</strong> Personalizam anúncios (com seu consentimento)</li>
                                    </ul>
                                </div>
                                <p>
                                    Você pode gerenciar cookies através das configurações do seu navegador.
                                </p>
                            </div>
                        </section>

                        {/* Menores */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">10. Menores de Idade</h2>
                            <p className="text-gray-700">
                                Nossa plataforma não é destinada a menores de 18 anos. Não coletamos intencionalmente dados de menores.
                                Se identificarmos que coletamos dados de um menor sem consentimento dos pais/responsáveis, tomaremos
                                medidas para excluir essas informações.
                            </p>
                        </section>

                        {/* Transferência Internacional */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">11. Transferência Internacional de Dados</h2>
                            <p className="text-gray-700">
                                Alguns de nossos provedores de serviços podem estar localizados fora do Brasil. Nestes casos,
                                garantimos que a transferência seja realizada em conformidade com a LGPD, adotando salvaguardas
                                adequadas como cláusulas contratuais padrão.
                            </p>
                        </section>

                        {/* Alterações */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">12. Alterações nesta Política</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>
                                    Podemos atualizar esta Política de Privacidade periodicamente. Alterações significativas serão
                                    comunicadas por e-mail ou através de aviso na plataforma.
                                </p>
                                <p>
                                    Recomendamos que você revise esta política regularmente para se manter informado sobre como
                                    protegemos seus dados.
                                </p>
                            </div>
                        </section>

                        {/* Reclamações */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">13. Reclamações</h2>
                            <p className="text-gray-700">
                                Se você acredita que seus direitos de privacidade foram violados, pode apresentar uma reclamação à
                                Autoridade Nacional de Proteção de Dados (ANPD) através do site:{" "}
                                <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-turquoise hover:underline">
                                    www.gov.br/anpd
                                </a>
                            </p>
                        </section>

                        {/* Contato */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">14. Contato</h2>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <p className="text-gray-700 mb-3">
                                    Para questões sobre esta Política de Privacidade ou sobre o tratamento de seus dados pessoais:
                                </p>
                                <p className="text-gray-700">
                                    <strong>E-mail:</strong>{" "}
                                    <a href="mailto:privacidade@masterfisher.com.br" className="text-turquoise hover:underline font-semibold">
                                        privacidade@masterfisher.com.br
                                    </a>
                                </p>
                            </div>
                        </section>

                        {/* Consentimento */}
                        <section className="bg-ocean-deep/5 p-6 rounded-lg border-l-4 border-ocean-deep">
                            <p className="text-gray-700 font-semibold">
                                Ao usar o MasterFisher, você declara que leu e compreendeu esta Política de Privacidade e
                                concorda com o tratamento de seus dados pessoais conforme descrito.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Privacy;
