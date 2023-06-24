<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230215140647 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE admin');
        $this->addSql('ALTER TABLE advert ADD dimension_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE advert ADD CONSTRAINT FK_54F1F40B277428AD FOREIGN KEY (dimension_id) REFERENCES size (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_54F1F40B277428AD ON advert (dimension_id)');
        $this->addSql('ALTER TABLE object_transport ADD advert_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE object_transport ADD CONSTRAINT FK_25141EA9D07ECCB6 FOREIGN KEY (advert_id) REFERENCES advert (id)');
        $this->addSql('CREATE INDEX IDX_25141EA9D07ECCB6 ON object_transport (advert_id)');
        $this->addSql('ALTER TABLE object_type ADD advert_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE object_type ADD CONSTRAINT FK_11CB6B3AD07ECCB6 FOREIGN KEY (advert_id) REFERENCES advert (id)');
        $this->addSql('CREATE INDEX IDX_11CB6B3AD07ECCB6 ON object_type (advert_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE admin (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, roles LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci` COMMENT \'(DC2Type:json)\', password VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, UNIQUE INDEX UNIQ_880E0D76E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE advert DROP FOREIGN KEY FK_54F1F40B277428AD');
        $this->addSql('DROP INDEX UNIQ_54F1F40B277428AD ON advert');
        $this->addSql('ALTER TABLE advert DROP dimension_id');
        $this->addSql('ALTER TABLE object_transport DROP FOREIGN KEY FK_25141EA9D07ECCB6');
        $this->addSql('DROP INDEX IDX_25141EA9D07ECCB6 ON object_transport');
        $this->addSql('ALTER TABLE object_transport DROP advert_id');
        $this->addSql('ALTER TABLE object_type DROP FOREIGN KEY FK_11CB6B3AD07ECCB6');
        $this->addSql('DROP INDEX IDX_11CB6B3AD07ECCB6 ON object_type');
        $this->addSql('ALTER TABLE object_type DROP advert_id');
    }
}
