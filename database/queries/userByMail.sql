USE covidtrack;
DELIMITER $$
CREATE PROCEDURE `userFindByMail`(
	IN _type VARCHAR(8),
	IN _mail VARCHAR(40)
)
BEGIN
	IF _type = 'paciente' THEN
		SELECT * FROM paciente WHERE pac_email=_mail;
	ELSE
		SELECT * FROM doctores WHERE doc_email=_mail;
	END IF;
END
DELIMITER $$;