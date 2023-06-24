<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230217150451 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE baggagite ADD adresse_point_depart VARCHAR(255) NOT NULL, ADD adresse_point_arrivee VARCHAR(255) NOT NULL, ADD commentaire LONGTEXT NOT NULL, ADD contenu_refuse LONGTEXT NOT NULL COMMENT \'(DC2Type:json)\'');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE baggagite DROP adresse_point_depart, DROP adresse_point_arrivee, DROP commentaire, DROP contenu_refuse');
    }
}
