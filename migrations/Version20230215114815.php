<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230215114815 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE baggagite (id INT AUTO_INCREMENT NOT NULL, dimension_id INT DEFAULT NULL, created_at DATETIME NOT NULL, date_from DATE NOT NULL, date_to DATE NOT NULL, time_from TIME NOT NULL, time_to TIME NOT NULL, adress_from VARCHAR(255) NOT NULL, adress_to VARCHAR(255) NOT NULL, status INT NOT NULL, not_contain LONGTEXT DEFAULT NULL COMMENT \'(DC2Type:json)\', UNIQUE INDEX UNIQ_E01318ED277428AD (dimension_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE baggagite_advert (baggagite_id INT NOT NULL, advert_id INT NOT NULL, INDEX IDX_D10FF8C3C1DE5FA4 (baggagite_id), INDEX IDX_D10FF8C3D07ECCB6 (advert_id), PRIMARY KEY(baggagite_id, advert_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE object_transport (id INT AUTO_INCREMENT NOT NULL, baggagite_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, INDEX IDX_25141EA9C1DE5FA4 (baggagite_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE baggagite ADD CONSTRAINT FK_E01318ED277428AD FOREIGN KEY (dimension_id) REFERENCES size (id)');
        $this->addSql('ALTER TABLE baggagite_advert ADD CONSTRAINT FK_D10FF8C3C1DE5FA4 FOREIGN KEY (baggagite_id) REFERENCES baggagite (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE baggagite_advert ADD CONSTRAINT FK_D10FF8C3D07ECCB6 FOREIGN KEY (advert_id) REFERENCES advert (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE object_transport ADD CONSTRAINT FK_25141EA9C1DE5FA4 FOREIGN KEY (baggagite_id) REFERENCES baggagite (id)');
        $this->addSql('DROP TABLE admin');
        $this->addSql('ALTER TABLE advert ADD status INT NOT NULL');
        $this->addSql('ALTER TABLE object_type ADD baggagite_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE object_type ADD CONSTRAINT FK_11CB6B3AC1DE5FA4 FOREIGN KEY (baggagite_id) REFERENCES baggagite (id)');
        $this->addSql('CREATE INDEX IDX_11CB6B3AC1DE5FA4 ON object_type (baggagite_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE object_type DROP FOREIGN KEY FK_11CB6B3AC1DE5FA4');
        $this->addSql('CREATE TABLE admin (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, roles LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci` COMMENT \'(DC2Type:json)\', password VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, UNIQUE INDEX UNIQ_880E0D76E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE baggagite DROP FOREIGN KEY FK_E01318ED277428AD');
        $this->addSql('ALTER TABLE baggagite_advert DROP FOREIGN KEY FK_D10FF8C3C1DE5FA4');
        $this->addSql('ALTER TABLE baggagite_advert DROP FOREIGN KEY FK_D10FF8C3D07ECCB6');
        $this->addSql('ALTER TABLE object_transport DROP FOREIGN KEY FK_25141EA9C1DE5FA4');
        $this->addSql('DROP TABLE baggagite');
        $this->addSql('DROP TABLE baggagite_advert');
        $this->addSql('DROP TABLE object_transport');
        $this->addSql('ALTER TABLE advert DROP status');
        $this->addSql('DROP INDEX IDX_11CB6B3AC1DE5FA4 ON object_type');
        $this->addSql('ALTER TABLE object_type DROP baggagite_id');
    }
}
