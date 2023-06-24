<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230302104317 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE admin');
        $this->addSql('ALTER TABLE baggiste_query ADD date_from DATE NOT NULL, ADD date_to DATE NOT NULL, ADD time_from TIME NOT NULL, ADD time_to TIME NOT NULL, ADD adress_from VARCHAR(255) NOT NULL, ADD adress_to VARCHAR(255) NOT NULL, ADD not_contain LONGTEXT DEFAULT NULL COMMENT \'(DC2Type:json)\', ADD object_type LONGTEXT DEFAULT NULL COMMENT \'(DC2Type:json)\', ADD object_transport LONGTEXT DEFAULT NULL COMMENT \'(DC2Type:json)\', ADD adresse_point_depart VARCHAR(255) NOT NULL, ADD adresse_point_arrivee VARCHAR(255) NOT NULL, ADD commentaire LONGTEXT NOT NULL, ADD type_adresse_depart VARCHAR(255) NOT NULL, ADD type_adresse_arrivee VARCHAR(255) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE admin (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, roles LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci` COMMENT \'(DC2Type:json)\', password VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, UNIQUE INDEX UNIQ_880E0D76E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE baggiste_query DROP date_from, DROP date_to, DROP time_from, DROP time_to, DROP adress_from, DROP adress_to, DROP not_contain, DROP object_type, DROP object_transport, DROP adresse_point_depart, DROP adresse_point_arrivee, DROP commentaire, DROP type_adresse_depart, DROP type_adresse_arrivee');
    }
}
