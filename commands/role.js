const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Distributes roles!')
    .addRoleOption(option => 
        option.setName('role')
        .setDescription('Choose a role to add/remove')
        .setRequired(true)
    )
    .addUserOption(option => 
      option.setName('user')
      .setDescription('Choose an user to add/remove a role')
      .setRequired(false)
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has("MANAGE_ROLES")) {
        return send("You don't have permission to use this command", interaction);
    }

    const user = interaction.options.getUser('user') || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
        return send("Please mention a valid member of this server", interaction);
    }

    const role = interaction.options.getRole('role');

    if (!role) {
        return send("Please mention a valid role on this server", interaction);
    }

    if (member.roles.cache.has(role.id)) {
        member.roles.remove(role)
            .then(() => send(`<@${member.user.id}> has been removed from the ${role} role`, interaction))
            .catch(error => {
                console.error(error);
                send("Error occurred while removing role", interaction);
            });
    } else {
        member.roles.add(role)
            .then(() => send(`<@${member.user.id}> has been added to the ${role} role`, interaction))
            .catch(error => {
                console.error(error);
                send("Error occurred while adding role", interaction);
            });
    }
  },
};


async function send(message, interaction)
{
  if (interaction.replied || interaction.deferred) {
    await interaction.followUp(message);
  } else {
    await interaction.reply(message);
  }
}