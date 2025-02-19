<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:html="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" indent="yes" encoding="UTF-8"/>
  
  <xsl:template match="/passport">
    <html>
      <head>
        <title>Паспортні дані</title>
        <link rel="stylesheet" type="text/css" href="passport.css"/>
      </head>
      <body>
        <div class="container">
          <div class="made-by">
            <xsl:value-of select="made_by"/>
          </div>
          
          <div class="passports">
            <xsl:apply-templates select="personal"/>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
  
  <xsl:template match="personal">
    <div class="passport-entry">
      <div class="passport-details">
        <p><xsl:value-of select="last_name"/></p>
        <p><xsl:value-of select="first_name"/></p>
        <p><xsl:value-of select="middle_name"/></p>
        <div class="photo">
          <img>
            <xsl:attribute name="src">
               <xsl:value-of select="html/img/@src"/>
            </xsl:attribute>
            <xsl:attribute name="alt">
              <xsl:value-of select="first_name"/>
              <xsl:text> </xsl:text>
              <xsl:value-of select="last_name"/>
            </xsl:attribute>
          </img>
        </div>
        <div class="info">
          <p><xsl:value-of select="address"/></p>
          <p><xsl:value-of select="id_number"/></p>
        </div>
      </div>
    </div>
  </xsl:template>

</xsl:stylesheet>