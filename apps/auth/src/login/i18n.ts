import { i18nBuilder } from "keycloakify/login"
import type { ThemeName } from "../kc.gen"

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
  .withThemeName<ThemeName>()
  .withCustomTranslations({
    tr: {
      deleteAccountConfirm: "Hesap silme onayı",
      irreversibleAction: "Bu işlem geri alınamaz",
      deletingImplies: "Hesabınızı silmek şunları gerektirir:",
      loggingOutImmediately: "Derhal oturumunuz kapatılır",
      errasingData: "Tüm verileriniz silinir",
      finalDeletionConfirmation:
        "Hesabınızı silerseniz geri yüklenemez. Hesabınızı korumak için İptal'e tıklayın.",
      doConfirmDelete: "Silmeyi onayla",
    },
    ru: {
      deleteAccountConfirm: "Подтверждение удаления аккаунта",
      irreversibleAction: "Это действие необратимо",
      deletingImplies: "Удаление аккаунта подразумевает:",
      loggingOutImmediately: "Немедленный выход из системы",
      errasingData: "Удаление всех ваших данных",
      finalDeletionConfirmation:
        "Если вы удалите свой аккаунт, его невозможно будет восстановить. Чтобы сохранить аккаунт, нажмите «Отмена».",
      doConfirmDelete: "Подтвердить удаление",
    },
    it: {
      deleteAccountConfirm: "Conferma eliminazione account",
      irreversibleAction: "Questa azione è irreversibile",
      deletingImplies: "L'eliminazione del tuo account comporta:",
      loggingOutImmediately: "La disconnessione immediata",
      errasingData: "La cancellazione di tutti i tuoi dati",
      finalDeletionConfirmation:
        "Se elimini il tuo account, non potrà essere ripristinato. Per mantenere il tuo account, fai clic su Annulla.",
      doConfirmDelete: "Conferma eliminazione",
    },
    ja: {
      deleteAccountConfirm: "アカウント削除の確認",
      irreversibleAction: "この操作は元に戻せません",
      deletingImplies: "アカウントを削除すると以下のことが行われます：",
      loggingOutImmediately: "直ちにログアウトされます",
      errasingData: "すべてのデータが消去されます",
      finalDeletionConfirmation:
        "アカウントを削除すると復元できません。アカウントを維持するには「キャンセル」をクリックしてください。",
      doConfirmDelete: "削除を確認",
    },
    da: {
      deleteAccountConfirm: "Bekræft sletning af konto",
      irreversibleAction: "Denne handling er irreversibel",
      deletingImplies: "Sletning af din konto indebærer:",
      loggingOutImmediately: "Du logges ud med det samme",
      errasingData: "Sletning af alle dine data",
      finalDeletionConfirmation:
        "Hvis du sletter din konto, kan den ikke gendannes. Klik på Annuller for at beholde din konto.",
      doConfirmDelete: "Bekræft sletning",
    },
    nl: {
      deleteAccountConfirm: "Bevestiging accountverwijdering",
      irreversibleAction: "Deze actie is onomkeerbaar",
      deletingImplies: "Het verwijderen van je account houdt in:",
      loggingOutImmediately: "Direct uitloggen",
      errasingData: "Al je gegevens worden gewist",
      finalDeletionConfirmation:
        "Als je je account verwijdert, kan het niet worden hersteld. Klik op Annuleren om je account te behouden.",
      doConfirmDelete: "Verwijdering bevestigen",
    },
    no: {
      deleteAccountConfirm: "Bekreft sletting av konto",
      irreversibleAction: "Denne handlingen er irreversibel",
      deletingImplies: "Sletting av kontoen din innebærer:",
      loggingOutImmediately: "Du logges ut umiddelbart",
      errasingData: "Sletting av alle dataene dine",
      finalDeletionConfirmation:
        "Hvis du sletter kontoen din, kan den ikke gjenopprettes. Klikk Avbryt for å beholde kontoen.",
      doConfirmDelete: "Bekreft sletting",
    },
    pl: {
      deleteAccountConfirm: "Potwierdzenie usunięcia konta",
      irreversibleAction: "Ta operacja jest nieodwracalna",
      deletingImplies: "Usunięcie konta oznacza:",
      loggingOutImmediately: "Natychmiastowe wylogowanie",
      errasingData: "Usunięcie wszystkich danych",
      finalDeletionConfirmation:
        "Jeśli usuniesz swoje konto, nie będzie można go przywrócić. Aby zachować konto, kliknij Anuluj.",
      doConfirmDelete: "Potwierdź usunięcie",
    },
    sv: {
      deleteAccountConfirm: "Bekräfta radering av konto",
      irreversibleAction: "Denna åtgärd är oåterkallelig",
      deletingImplies: "Att radera ditt konto innebär:",
      loggingOutImmediately: "Du loggas ut omedelbart",
      errasingData: "Radering av alla dina uppgifter",
      finalDeletionConfirmation:
        "Om du raderar ditt konto kan det inte återställas. Klicka på Avbryt för att behålla ditt konto.",
      doConfirmDelete: "Bekräfta radering",
    },
    lv: {
      deleteAccountConfirm: "Konta dzēšanas apstiprinājums",
      irreversibleAction: "Šī darbība ir neatgriezeniska",
      deletingImplies: "Konta dzēšana nozīmē:",
      loggingOutImmediately: "Tūlītēja izrakstīšanās",
      errasingData: "Visu jūsu datu dzēšana",
      finalDeletionConfirmation:
        "Ja izdzēsīsiet savu kontu, to nevarēs atjaunot. Lai saglabātu kontu, noklikšķiniet uz Atcelt.",
      doConfirmDelete: "Apstiprināt dzēšanu",
    },
    lt: {
      deleteAccountConfirm: "Paskyros ištrynimo patvirtinimas",
      irreversibleAction: "Šis veiksmas yra negrįžtamas",
      deletingImplies: "Paskyros ištrynimas reiškia:",
      loggingOutImmediately: "Nedelsiant būsite atjungtas",
      errasingData: "Visų jūsų duomenų ištrynimą",
      finalDeletionConfirmation:
        "Jei ištrinsite paskyrą, jos nebebus galima atkurti. Norėdami išsaugoti paskyrą, spustelėkite Atšaukti.",
      doConfirmDelete: "Patvirtinti ištrynimą",
    },
  })
  .build()

type I18n = typeof ofTypeI18n

export { useI18n, type I18n }
