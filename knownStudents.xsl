<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" encoding="utf-8" />
	<xsl:template match="/">
		<xsl:for-each select="aluno">
			<option>
				<xsl:attribute name="value">
					<xsl:value-of select="@id" />
				</xsl:attribute>
				<xsl:value-of select="nome" />
			</option>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>