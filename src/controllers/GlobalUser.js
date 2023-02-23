/* eslint-disable prettier/prettier */
const { v4: uuidv4 } = require('uuid');
const Mail = require('../mail/mail');
const GlobalUserModel = require('../models/GlobalUser');
const { createHmac } = require('crypto');
require('dotenv').config();

function encryptData(data) {
  const hash = createHmac(process.env.ALGORITHM, process.env.SECRET)
    .update(data)
    .digest(process.env.OUTPUT);
  return hash;
}

module.exports = {
  async create(request, response) {
    try {
      const globalUser = request.body;
      globalUser.id = uuidv4();
      globalUser.password = encryptData(globalUser.password);

      await GlobalUserModel.create(globalUser);
      return response.status(201).json({ id: globalUser.id });
    } catch (err) {
      console.error(`GlobalUser creation failed: ${err}`);
      return response.status(500).json({
        notification: 'Internal server error',
      });
    }
  },

  async getAll(request, response) {
    try {
      const result = await GlobalUserModel.getAll();

      return response.status(200).json(result);
    } catch (err) {
      console.error(`GlobalUser getAll failed: ${err}`);
      return response.status(500).json({
        notification: 'Internal server error',
      });
    }
  },

  async getById(request, response) {
    try {
      const { id } = request.params;
      const result = await GlobalUserModel.getById(id);
      return response.status(200).json(result);
    } catch (err) {
      console.error(`GlobalUser getById failed: ${err}`);
      return response.status(500).json({
        notification: 'Internal server error',
      });
    }
  },

  async getByUserName(request, response) {
    try {
      const { user_name } = request.params;
      const result = await GlobalUserModel.getByUserName(user_name);
      return response.status(200).json(result);
    } catch (err) {
      console.error(`GlobalUser getByUserName failed: ${err}`);
      return response.status(500).json({
        notification: 'Internal server error',
      });
    }
  },

  async getByUserEmail(request, response) {
    try {
      const { email } = request.params;
      const result = await GlobalUserModel.getByUserEmail(email);
      return response.status(200).json(result);
    } catch (err) {
      console.error(`GlobalUser getByEmail failed: ${err}`);
      return response.status(500).json({
        notification: 'Internal server error',
      });
    }
  },

  async getByType(request, response) {
    try {
      const { type } = request.params;
      const result = await GlobalUserModel.getByType(type);
      return response.status(200).json(result);
    } catch (err) {
      console.error(`GlobalUser getByType failed: ${err}`);
      return response.status(500).json({
        notification: 'Internal server error',
      });
    }
  },

  async update(request, response) {
    try {
      const { id } = request.params;
      const globalUser = request.body;

      const stillExistFieldsToUpdate = Object.values(globalUser).length > 0;
      if (stillExistFieldsToUpdate) {
        await GlobalUserModel.updateById(id, globalUser);
      }
      return response.status(200).json('OK');
    } catch (err) {
      console.error(`GlobalUser update failed: ${err}`);
      return response.status(500).json({
        notification: 'Internal server error',
      });
    }
  },

  async updatePassword(request, response) {
    try {
      const { id } = request.params;
      const inputs = request.body;

      const user = await GlobalUserModel.getById(id);
      const currentPass = encryptData(inputs.currentPass);
      if (currentPass === user[0].password) {
        const newPass = encryptData(inputs.newPass);
        try {
          await GlobalUserModel.updateById(id, { password: newPass });
          return response.status(200).json('OK');
        } catch (err) {
          console.error(`GlobalUser update failed: ${err}`);
          return response.status(500).json({
            notification: 'Internal server error',
          });
        }
      } else {
        return response.status(530).json({
          notification: 'Senhas não conferem',
        });
      }
    } catch (err) {
      console.error(`GlobalUser update failed: ${err}`);
      return response.status(500).json({
        notification: 'Internal server error',
      });
    }
  },

  async userRefused(request, response) {
    try {
      const { id } = request.params;

      const userGlobal = await GlobalUserModel.getById(id);
      await GlobalUserModel.deleteById(id);
      Mail.UserRefused(userGlobal.email, userGlobal.name);
      return response.status(200).json("OK");

    } catch (err) {
      console.error(`GlobalUser delete failed: ${err}`);
      return response.status(500).json({
        notification: 'Internal server error',
      });
    }
  },

  async delete(request, response) {
    try {
      const { id } = request.params;
      await GlobalUserModel.deleteById(id);
      return response.status(200).json("OK");
    } catch (err) {
      console.error(`GlobalUser delete failed: ${err}`);
      return response.status(500).json({
        notification: 'Internal server error',
      });
    }
  },
};
