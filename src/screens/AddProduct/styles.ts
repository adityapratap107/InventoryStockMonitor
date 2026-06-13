// Purpose: Styling definition for the AddProductScreen.
import { StyleSheet } from 'react-native';
import { BACKGROUND, TEXT_PRIMARY, TEXT_SECONDARY, BORDER, CARD_BG } from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    shadowColor: TEXT_SECONDARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  chevron: {
    width: 10,
    height: 10,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: TEXT_PRIMARY,
    transform: [{ rotate: '45deg' }],
    marginLeft: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginLeft: 16,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: TEXT_SECONDARY,
    letterSpacing: 0.8,
    marginBottom: 14,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 24,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
  flex1: {
    flex: 1,
  },
});
