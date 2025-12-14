import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsOfUse = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1 bg-gray-50">
                <div className="container mx-auto px-4 py-12 max-w-4xl">
                    <h1 className="font-display text-4xl font-bold text-ocean-deep mb-4">
                        Termos de Uso
                    </h1>
                    <p className="text-sm text-gray-600 mb-8">
                        Última atualização: {new Date().toLocaleDateString('pt-BR')}
                    </p>

                    <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
                        {/* Introdução */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">1. Introdução</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Bem-vindo ao MasterFisher. Ao acessar e usar nossa plataforma, você concorda com estes Termos de Uso.
                                O MasterFisher é uma plataforma que conecta turistas interessados em pesca esportiva com guias de pesca
                                profissionais em diversas regiões do Brasil.
                            </p>
                        </section>

                        {/* Definições */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">2. Definições</h2>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li><strong>Plataforma:</strong> O site MasterFisher e todos os seus serviços relacionados.</li>
                                <li><strong>Usuário:</strong> Qualquer pessoa que acessa a plataforma.</li>
                                <li><strong>Guia:</strong> Profissional de pesca cadastrado que oferece serviços através da plataforma.</li>
                                <li><strong>Turista:</strong> Usuário que busca contratar serviços de guias de pesca.</li>
                                <li><strong>Serviços:</strong> Atividades de pesca esportiva oferecidas pelos guias.</li>
                            </ul>
                        </section>

                        {/* Cadastro e Conta */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">3. Cadastro e Conta de Usuário</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>
                                    <strong>3.1.</strong> Para utilizar determinados recursos da plataforma, você deve criar uma conta fornecendo
                                    informações precisas, completas e atualizadas.
                                </p>
                                <p>
                                    <strong>3.2.</strong> Você é responsável por manter a confidencialidade de sua senha e por todas as atividades
                                    realizadas em sua conta.
                                </p>
                                <p>
                                    <strong>3.3.</strong> Você deve ter pelo menos 18 anos de idade para criar uma conta.
                                </p>
                                <p>
                                    <strong>3.4.</strong> Você concorda em notificar imediatamente o MasterFisher sobre qualquer uso não autorizado
                                    de sua conta.
                                </p>
                            </div>
                        </section>

                        {/* Uso da Plataforma */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">4. Uso da Plataforma</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>
                                    <strong>4.1.</strong> O MasterFisher atua como intermediário, conectando guias e turistas. Não somos responsáveis
                                    pela qualidade, segurança ou legalidade dos serviços prestados pelos guias.
                                </p>
                                <p>
                                    <strong>4.2.</strong> Você concorda em usar a plataforma apenas para fins legais e de acordo com estes Termos.
                                </p>
                                <p>
                                    <strong>4.3.</strong> É proibido:
                                </p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Usar a plataforma para qualquer finalidade ilegal ou não autorizada</li>
                                    <li>Publicar conteúdo falso, enganoso, difamatório ou ofensivo</li>
                                    <li>Interferir ou interromper o funcionamento da plataforma</li>
                                    <li>Coletar informações de outros usuários sem autorização</li>
                                    <li>Violar direitos de propriedade intelectual</li>
                                </ul>
                            </div>
                        </section>

                        {/* Serviços de Guias */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">5. Serviços de Guias de Pesca</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>
                                    <strong>5.1.</strong> Os guias são profissionais independentes responsáveis por seus próprios serviços,
                                    equipamentos, seguros e licenças necessárias.
                                </p>
                                <p>
                                    <strong>5.2.</strong> O MasterFisher não garante a disponibilidade, qualidade ou adequação dos serviços
                                    oferecidos pelos guias.
                                </p>
                                <p>
                                    <strong>5.3.</strong> Turistas e guias devem negociar diretamente os termos específicos de cada serviço,
                                    incluindo preços, datas, locais e condições.
                                </p>
                                <p>
                                    <strong>5.4.</strong> Guias devem possuir todas as licenças, autorizações e seguros exigidos pela legislação
                                    aplicável para exercer suas atividades.
                                </p>
                            </div>
                        </section>

                        {/* Pagamentos e Taxas */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">6. Pagamentos e Taxas</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>
                                    <strong>6.1.</strong> Guias pagam uma taxa anual de R$ 50,00 para manter seu perfil ativo na plataforma.
                                </p>
                                <p>
                                    <strong>6.2.</strong> Os pagamentos são processados através do Mercado Pago.
                                </p>
                                <p>
                                    <strong>6.3.</strong> As taxas pagas não são reembolsáveis, exceto conforme exigido por lei.
                                </p>
                                <p>
                                    <strong>6.4.</strong> O MasterFisher reserva-se o direito de alterar suas taxas mediante aviso prévio de 30 dias.
                                </p>
                                <p>
                                    <strong>6.5.</strong> Pagamentos de serviços entre turistas e guias são de responsabilidade exclusiva das partes
                                    envolvidas.
                                </p>
                            </div>
                        </section>

                        {/* Responsabilidades e Limitações */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">7. Responsabilidades e Limitações de Responsabilidade</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>
                                    <strong>7.1.</strong> O MasterFisher não se responsabiliza por:
                                </p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Acidentes, lesões ou danos ocorridos durante as atividades de pesca</li>
                                    <li>Qualidade, segurança ou legalidade dos serviços prestados pelos guias</li>
                                    <li>Disputas entre turistas e guias</li>
                                    <li>Perda de equipamentos ou pertences pessoais</li>
                                    <li>Condições climáticas ou ambientais adversas</li>
                                </ul>
                                <p className="mt-3">
                                    <strong>7.2.</strong> A plataforma é fornecida "como está" sem garantias de qualquer tipo.
                                </p>
                                <p>
                                    <strong>7.3.</strong> Em nenhuma circunstância o MasterFisher será responsável por danos indiretos,
                                    incidentais, especiais ou consequenciais.
                                </p>
                            </div>
                        </section>

                        {/* Propriedade Intelectual */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">8. Propriedade Intelectual</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>
                                    <strong>8.1.</strong> Todo o conteúdo da plataforma, incluindo textos, gráficos, logos, ícones e software,
                                    é propriedade do MasterFisher ou de seus licenciadores.
                                </p>
                                <p>
                                    <strong>8.2.</strong> Você não pode copiar, modificar, distribuir ou criar obras derivadas sem autorização prévia.
                                </p>
                                <p>
                                    <strong>8.3.</strong> Ao publicar conteúdo na plataforma, você concede ao MasterFisher uma licença não exclusiva
                                    para usar, reproduzir e exibir esse conteúdo.
                                </p>
                            </div>
                        </section>

                        {/* Privacidade */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">9. Privacidade</h2>
                            <p className="text-gray-700">
                                O uso de suas informações pessoais é regido por nossa{" "}
                                <a href="/privacidade" className="text-turquoise hover:underline font-semibold">
                                    Política de Privacidade
                                </a>
                                , que faz parte integrante destes Termos de Uso.
                            </p>
                        </section>

                        {/* Modificações */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">10. Modificações dos Termos</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>
                                    <strong>10.1.</strong> O MasterFisher reserva-se o direito de modificar estes Termos a qualquer momento.
                                </p>
                                <p>
                                    <strong>10.2.</strong> Alterações significativas serão notificadas por e-mail ou através da plataforma.
                                </p>
                                <p>
                                    <strong>10.3.</strong> O uso continuado da plataforma após as modificações constitui aceitação dos novos Termos.
                                </p>
                            </div>
                        </section>

                        {/* Rescisão */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">11. Rescisão</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>
                                    <strong>11.1.</strong> Você pode encerrar sua conta a qualquer momento através das configurações da plataforma.
                                </p>
                                <p>
                                    <strong>11.2.</strong> O MasterFisher pode suspender ou encerrar sua conta se você violar estes Termos.
                                </p>
                                <p>
                                    <strong>11.3.</strong> Após o encerramento, você não terá mais acesso aos serviços da plataforma.
                                </p>
                            </div>
                        </section>

                        {/* Lei Aplicável */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">12. Lei Aplicável e Jurisdição</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>
                                    <strong>12.1.</strong> Estes Termos são regidos pelas leis da República Federativa do Brasil.
                                </p>
                                <p>
                                    <strong>12.2.</strong> Qualquer disputa será resolvida no foro da comarca de [CIDADE], com exclusão de qualquer outro.
                                </p>
                            </div>
                        </section>

                        {/* Contato */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">13. Contato</h2>
                            <p className="text-gray-700">
                                Para questões sobre estes Termos de Uso, entre em contato conosco através do e-mail:{" "}
                                <a href="mailto:contato@masterfisher.com.br" className="text-turquoise hover:underline font-semibold">
                                    contato@masterfisher.com.br
                                </a>
                            </p>
                        </section>

                        {/* Disposições Gerais */}
                        <section>
                            <h2 className="text-2xl font-bold text-ocean-deep mb-4">14. Disposições Gerais</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>
                                    <strong>14.1.</strong> Se qualquer disposição destes Termos for considerada inválida, as demais permanecerão
                                    em pleno vigor.
                                </p>
                                <p>
                                    <strong>14.2.</strong> A falha do MasterFisher em exercer qualquer direito não constitui renúncia a esse direito.
                                </p>
                                <p>
                                    <strong>14.3.</strong> Estes Termos constituem o acordo integral entre você e o MasterFisher.
                                </p>
                            </div>
                        </section>

                        {/* Aceitação */}
                        <section className="bg-ocean-deep/5 p-6 rounded-lg border-l-4 border-ocean-deep">
                            <p className="text-gray-700 font-semibold">
                                Ao usar o MasterFisher, você declara que leu, compreendeu e concorda em estar vinculado a estes Termos de Uso.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TermsOfUse;
