module.exports = {
    // queries in index.js
    getUserByMail: 'CALL getUserByMail(?,?);',
    getDocByDNI:
        'SELECT doctores.doc_dni, doc_apellidos, doc_nombres, doc_email, doc_celular,doc_sexo,doc_especialidad FROM doctores WHERE doc_dni=?',
    getPacsDNI: 'SELECT pac_dni FROM paciente',
    getCitasByDocDNI: 'SELECT * FROM citas WHERE doc_dni=?',
    getPacByDNI: 'SELECT * FROM paciente WHERE pac_dni= ?',
    createPac: 'INSERT INTO paciente SET ?',
    // queries in doctor.js
    getPacByDocDNI: 'SELECT pac_apellidos, pac_nombres, pac_dni, pac_celular FROM paciente WHERE doc_dni =?',
    getFormsByDocDNI: 'select * from formulario WHERE doc_dni =?',
    getCitasDetailsByDocDNI: `
            SELECT pac_nombres, pac_apellidos, citas.fecha, citas.estado, citas.pac_dni 
            FROM citas
            INNER JOIN paciente
            ON citas.pac_dni = paciente.pac_dni
            WHERE citas.doc_dni=?;
        `,
    updateDocByDNI: 'UPDATE doctores SET doc_email=?, doc_celular=? WHERE doc_dni=?',
    updateDocPassByMail: 'UPDATE doctores SET doc_contrasenia=? WHERE doc_email=?',
    createCita: 'INSERT INTO citas SET?',
    deleteCita: 'DELETE FROM citas WHERE pac_dni=? AND fecha=?;',
    // queries in paciente.js
    getCitasByPacDNI: 'SELECT * FROM citas WHERE pac_dni=?',
    updatePacByDNI: 'UPDATE paciente SET pac_distrito=?, pac_direccion=? , pac_celular=? WHERE pac_dni=?',
    updatePacPassByMail: 'UPDATE paciente SET pac_contrasenia=? WHERE pac_email=?',
    savePacForm: 'INSERT INTO formulario SET ?',
}