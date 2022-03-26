USE `covidtrack`;
DROP procedure IF EXISTS `deletePacData`;

DELIMITER $$
USE `covidtrack`$$
CREATE PROCEDURE `deletePacData`(
	IN _dni VARCHAR(9)
)
BEGIN
	SET SQL_SAFE_UPDATES = 0;
	DELETE FROM formulario WHERE pac_dni=_dni;
    DELETE FROM citas WHERE pac_dni=_dni;
    DELETE FROM mensajes WHERE emisor_dni=_dni;
    DELETE FROM paciente WHERE pac_dni=_dni;
	SET SQL_SAFE_UPDATES = 1;
END$$

DELIMITER ;