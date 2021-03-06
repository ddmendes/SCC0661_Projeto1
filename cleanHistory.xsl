<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:c="http://www.example.com/curriculo" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="curriculo curriculo.xsd" exclude-result-prefixes="c xsi">
	<xsl:param name="student" select="c:curriculos/c:aluno/@id" />
	<xsl:template match="/">
		<xsl:for-each select="c:curriculos/c:aluno">
			<xsl:if test="@id = $student">
				<table>
					<tr>
						<th colspan="7">
							Histórico Escolar
						</th>
					</tr>
					<tr>
						<td><strong>Nome:</strong></td>
						<td colspan="6"><xsl:value-of select="c:nome" /></td>
					</tr>
					<tr>
						<td><strong>NUSP:</strong></td>
						<td colspan="2"><xsl:value-of select="@id" /></td>
						<td><strong>Curso:</strong></td>
						<td colspan="3">Engenharia de Computação</td>
					</tr>
					<xsl:for-each select="c:semestre">
						<tr>
							<td><strong>Período</strong></td>
							<td colspan="6"><xsl:value-of select="@id" />o. Semestre</td>
						</tr>
						<tr>
							<td>Código</td>
							<td>Disciplina</td>
							<td>CA</td>
							<td>CT</td>
							<td>Freq</td>
							<td>Nota</td>
							<td>Status</td>
						</tr>
						<xsl:for-each select="c:disciplina">
							<xsl:if test="@status != 'reprovado'">
								<xsl:variable name="discRef" select="@ref" />
								<xsl:variable name="discFreq" select="c:frequencia" />
								<xsl:variable name="discGrade" select="c:nota" />
								<xsl:variable name="discStatus" select="@status" />
								<xsl:for-each select="/c:curriculos/c:disciplinasDisponiveis/c:curso/c:periodo">
									<xsl:for-each select="c:disciplina">
										<xsl:if test="$discRef = @id">
											<tr>
												<td><xsl:value-of select="@id" /></td>
												<td><xsl:value-of select="c:nome" /></td>
												<td><xsl:value-of select="c:creditos/c:aula" /></td>
												<td><xsl:value-of select="c:creditos/c:trabalho" /></td>
												<td><xsl:value-of select="$discFreq" /></td>
												<td><xsl:value-of select="$discGrade" /></td>
												<td>
													<xsl:choose>
														<xsl:when test="$discStatus = 'aprovado'">A</xsl:when>
														<xsl:when test="$discStatus = 'reprovado'">R</xsl:when>
														<xsl:when test="$discStatus = 'cursando'">C</xsl:when>
														<xsl:when test="$discStatus = 'trancado'">T</xsl:when>
													</xsl:choose>
												</td>
											</tr>
										</xsl:if>
									</xsl:for-each>
								</xsl:for-each>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</table>
			</xsl:if>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>