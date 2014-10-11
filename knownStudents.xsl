<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:c="http://www.example.com/curriculo" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="curriculo curriculo.xsd" exclude-result-prefixes="c xsi">
	<xsl:template match="/">
		<xsl:for-each select="c:curriculos/c:aluno">
			<option>
				<xsl:attribute name="value">
					<xsl:value-of select="@id" />
				</xsl:attribute>
				<xsl:value-of select="c:nome" />
			</option>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>